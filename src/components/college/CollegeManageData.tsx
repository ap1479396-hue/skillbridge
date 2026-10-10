import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { CollegeAdminConfig, DepartmentMetric, PlacementPipelineConfig } from '../../types';
import { DEFAULT_COLLEGE_CONFIG, DEFAULT_PLACEMENT_PIPELINE } from '../../services/collegeIntelligenceService';
import {
  searchInstitutions,
  InstitutionSearchResult,
  SearchOptions,
  INDIAN_INSTITUTION_DIRECTORY
} from '../../services/universitySearchService';
import {
  School,
  Building2,
  Users,
  Award,
  Briefcase,
  CheckCircle2,
  Save,
  RotateCcw,
  AlertCircle,
  ArrowLeft,
  Plus,
  Trash2,
  Check,
  Sliders,
  X,
  MapPin,
  Search,
  Loader2,
  Globe,
  Building
} from 'lucide-react';

interface CollegeManageDataProps {
  onBackToDashboard?: () => void;
}

export const CollegeManageData: React.FC<CollegeManageDataProps> = ({ onBackToDashboard }) => {
  const {
    collegeAdminConfig,
    updateCollegeAdminConfig,
    resetCollegeAdminConfig,
    setActiveTab,
    addNotification
  } = useApp();

  // Working copy of configuration for immediate in-place editing
  const [formData, setFormData] = useState<CollegeAdminConfig>(() => ({
    institution: { ...(collegeAdminConfig?.institution || DEFAULT_COLLEGE_CONFIG.institution) },
    departments: JSON.parse(JSON.stringify(collegeAdminConfig?.departments || DEFAULT_COLLEGE_CONFIG.departments)),
    corporatePartners: {
      ...(collegeAdminConfig?.corporatePartners || DEFAULT_COLLEGE_CONFIG.corporatePartners),
      topHiringRoles: Array.isArray(collegeAdminConfig?.corporatePartners?.topHiringRoles)
        ? [...collegeAdminConfig.corporatePartners.topHiringRoles]
        : [...DEFAULT_COLLEGE_CONFIG.corporatePartners.topHiringRoles]
    },
    placementPipeline: collegeAdminConfig?.placementPipeline
      ? { ...collegeAdminConfig.placementPipeline }
      : { ...DEFAULT_PLACEMENT_PIPELINE },
    internshipApplicationsOverride: collegeAdminConfig?.internshipApplicationsOverride ?? 890,
    isCustomized: Boolean(collegeAdminConfig?.isCustomized),
    lastUpdated: collegeAdminConfig?.lastUpdated
  }));

  const [activeSubSection, setActiveSubSection] = useState<'all' | 'institution' | 'departments' | 'pipeline' | 'partners'>('all');
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [newRoleInput, setNewRoleInput] = useState<string>('');
  const [showAddDeptModal, setShowAddDeptModal] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Location Filter State (Default: India)
  const [filterCountry, setFilterCountry] = useState<string>('India');
  const [filterState, setFilterState] = useState<string>('ALL');
  const [filterCity, setFilterCity] = useState<string>('ALL');
  const [resultLimit, setResultLimit] = useState<number>(10);

  // Autocomplete search states for real university & college database
  const [searchResults, setSearchResults] = useState<InstitutionSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [searchHasRun, setSearchHasRun] = useState<boolean>(false);
  const searchAbortRef = useRef<AbortController | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Indian States & Union Territories
  const INDIAN_STATES = useMemo(() => [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Delhi', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu',
    'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ], []);

  // Known Indian Cities by State with fallback merging
  const INDIAN_STATE_CITIES: Record<string, string[]> = useMemo(() => ({
    Maharashtra: ['Pune', 'Mumbai', 'Alandi', 'Nagpur', 'Nashik', 'Chhatrapati Sambhajinagar', 'Kolhapur', 'Navi Mumbai', 'Thane', 'Solapur', 'Amravati', 'Nanded', 'Sangli', 'Jalgaon'],
    Karnataka: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Manipal', 'Hubballi', 'Belagavi', 'Surathkal', 'Dharwad'],
    Delhi: ['New Delhi', 'Delhi'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Vellore', 'Thanjavur'],
    'Uttar Pradesh': ['Kanpur', 'Lucknow', 'Varanasi', 'Noida', 'Greater Noida', 'Prayagraj', 'Aligarh', 'Agra', 'Ghaziabad', 'Meerut'],
    Telangana: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
    Gujarat: ['Ahmedabad', 'Gandhinagar', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
    'West Bengal': ['Kolkata', 'Kharagpur', 'Durgapur', 'Siliguri', 'Howrah'],
    Rajasthan: ['Jaipur', 'Jodhpur', 'Kota', 'Pilani', 'Udaipur', 'Bikaner', 'Ajmer'],
    Kerala: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Palakkad', 'Thrissur', 'Kollam'],
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Kakinada'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'],
    Punjab: ['Chandigarh', 'Mohali', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Rupnagar'],
    Haryana: ['Gurugram', 'Faridabad', 'Rohtak', 'Sonipat', 'Kurukshetra', 'Ambala', 'Panipat'],
    Bihar: ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur'],
    Odisha: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Sambalpur'],
    Assam: ['Guwahati', 'Silchar', 'Tezpur', 'Jorhat'],
    Goa: ['Panaji', 'Margao', 'Ponda'],
    Uttarakhand: ['Dehradun', 'Roorkee', 'Pantnagar', 'Haridwar', 'Nainital'],
    Jharkhand: ['Ranchi', 'Jamshedpur', 'Dhanbad'],
    'Himachal Pradesh': ['Shimla', 'Mandi', 'Dharamshala', 'Solan'],
    'Jammu and Kashmir': ['Srinagar', 'Jammu'],
    Chandigarh: ['Chandigarh']
  }), []);

  // Compute available cities dynamically for selected state
  const availableCities = useMemo(() => {
    if (filterState === 'ALL') {
      return ['Pune', 'Mumbai', 'Alandi', 'Bengaluru', 'New Delhi', 'Chennai', 'Hyderabad', 'Kolkata', 'Kanpur', 'Ahmedabad', 'Jaipur'];
    }
    const known = INDIAN_STATE_CITIES[filterState] || [];
    // Also include any cities from Indian directory in that state
    const directoryCities = INDIAN_INSTITUTION_DIRECTORY
      .filter((i) => i.state.toLowerCase() === filterState.toLowerCase() && i.city)
      .map((i) => i.city);
    return Array.from(new Set([...known, ...directoryCities])).sort();
  }, [filterState, INDIAN_STATE_CITIES]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // Cleanup pending search timers on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (searchAbortRef.current) searchAbortRef.current.abort();
    };
  }, []);

  // Trigger debounced real registry search (ROR & OpenAlex APIs)
  const triggerInstitutionSearch = (
    query: string,
    countryOverride?: string,
    stateOverride?: string,
    cityOverride?: string
  ) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (searchAbortRef.current) {
      searchAbortRef.current.abort();
    }

    const activeCountry = countryOverride ?? filterCountry;
    const activeState = stateOverride ?? filterState;
    const activeCity = cityOverride ?? filterCity;

    const trimmed = (query || '').trim();
    if (trimmed.length < 2 && activeState === 'ALL' && activeCity === 'ALL') {
      setSearchResults([]);
      setIsSearching(false);
      setShowDropdown(false);
      setSearchHasRun(false);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);
    setResultLimit(10); // reset page limit on new search

    searchTimeoutRef.current = setTimeout(async () => {
      const controller = new AbortController();
      searchAbortRef.current = controller;

      try {
        const results = await searchInstitutions(
          trimmed,
          {
            country: activeCountry,
            state: activeState,
            city: activeCity
          },
          controller.signal
        );
        if (!controller.signal.aborted) {
          setSearchResults(results);
          setIsSearching(false);
          setSearchHasRun(true);
          setShowDropdown(true);
        }
      } catch (err: any) {
        if (!controller.signal.aborted) {
          if (err?.name !== 'AbortError') {
            console.warn('Institution registry search failed:', err);
          }
          setIsSearching(false);
          setSearchHasRun(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 350);
  };

  // Handle selecting an institution from the autocomplete suggestions
  const handleSelectInstitution = (inst: InstitutionSearchResult) => {
    if (!inst || !inst.name) return;
    clearError('institution.name');
    clearError('institution.shortCode');

    setFormData((prev) => {
      const currentShortCode = prev?.institution?.shortCode || '';
      let updatedShortCode = currentShortCode;
      if (inst.acronym && (!currentShortCode.trim() || currentShortCode === 'GCET')) {
        updatedShortCode = inst.acronym;
      } else if (!currentShortCode.trim()) {
        const initials = inst.name.match(/\b([A-Z])/g)?.join('').slice(0, 5) || 'INST';
        updatedShortCode = initials;
      }

      return {
        ...prev,
        institution: {
          ...prev.institution,
          name: inst.name,
          city: inst.city || '',
          state: inst.state || '',
          country: inst.country || 'India',
          countryCode: inst.countryCode || 'IN',
          institutionId: inst.id || '',
          institutionType: inst.institutionType || 'University',
          shortCode: updatedShortCode || 'INST',
          dataType: 'Custom'
        }
      };
    });

    setShowDropdown(false);
    setIsSearching(false);
    addNotification(
      `Selected "${inst.name}" (${[inst.city, inst.state, inst.country || 'India'].filter(Boolean).join(', ')}). Click "Save & Update Dashboard" to apply.`,
      'info'
    );
  };

  // Allow administrator to use custom institution name without registry link
  const handleUseCustomInstitution = () => {
    const customName = formData.institution.name.trim();
    if (!customName) return;

    setFormData((prev) => ({
      ...prev,
      institution: {
        ...prev.institution,
        name: customName,
        city: filterCity !== 'ALL' ? filterCity : prev.institution.city,
        state: filterState !== 'ALL' ? filterState : prev.institution.state,
        country: 'India',
        countryCode: 'IN',
        institutionId: '',
        institutionType: 'Institution',
        dataType: 'Custom'
      }
    }));

    setShowDropdown(false);
    setIsSearching(false);
    addNotification(`Using custom institution name: "${customName}". Click "Save & Update Dashboard" to apply.`, 'info');
  };

  const [newDeptForm, setNewDeptForm] = useState<DepartmentMetric>({
    code: '',
    name: '',
    totalStudents: 180,
    avgReadiness: 75,
    placementRate: 70,
    internshipRate: 65,
    placedCount: 35,
    interningCount: 78,
    majorGap: 'Full Stack & Cloud Tools'
  });

  // Track changes between local formData and currently saved global collegeAdminConfig
  const {
    isInstitutionModified,
    isDepartmentsModified,
    isPipelineModified,
    isPartnersModified,
    modifiedSectionsList
  } = useMemo(() => {
    const instMod = JSON.stringify(formData.institution) !== JSON.stringify(collegeAdminConfig.institution);
    const deptMod = JSON.stringify(formData.departments) !== JSON.stringify(collegeAdminConfig.departments);
    const pipeMod =
      JSON.stringify(formData.placementPipeline) !== JSON.stringify(collegeAdminConfig.placementPipeline || DEFAULT_PLACEMENT_PIPELINE) ||
      formData.internshipApplicationsOverride !== collegeAdminConfig.internshipApplicationsOverride;
    const partMod = JSON.stringify(formData.corporatePartners) !== JSON.stringify(collegeAdminConfig.corporatePartners);

    const list: string[] = [];
    if (instMod) list.push('Institution Info');
    if (deptMod) list.push('Department Metrics');
    if (pipeMod) list.push('Placement & Internships');
    if (partMod) list.push('Corporate Partners');

    return {
      isInstitutionModified: instMod,
      isDepartmentsModified: deptMod,
      isPipelineModified: pipeMod,
      isPartnersModified: partMod,
      modifiedSectionsList: list
    };
  }, [formData, collegeAdminConfig]);

  useEffect(() => {
    setHasChanges(modifiedSectionsList.length > 0);
  }, [modifiedSectionsList]);

  // Validation function per Requirement 11
  const validate = (data: CollegeAdminConfig): Record<string, string> => {
    const errors: Record<string, string> = {};

    // 1. Institution validation
    if (!data?.institution?.name || !data.institution.name.trim()) {
      errors['institution.name'] = 'Institution Name cannot be empty.';
    }
    if (!data?.institution?.shortCode || !data.institution.shortCode.trim()) {
      errors['institution.shortCode'] = 'Short Code cannot be empty.';
    }

    // 2. Department validation
    if (data?.departments && typeof data.departments === 'object') {
      Object.entries(data.departments).forEach(([dKey, dept]) => {
        if (!dept) return;
        if (!dept.code || !dept.code.trim()) {
          errors[`dept.${dKey}.code`] = 'Code required.';
        }
        if (!dept.name || !dept.name.trim()) {
          errors[`dept.${dKey}.name`] = 'Name required.';
        }
        if (typeof dept.totalStudents !== 'number' || isNaN(dept.totalStudents) || dept.totalStudents < 0) {
          errors[`dept.${dKey}.totalStudents`] = 'Students must be 0 or greater.';
        }
        if (typeof dept.avgReadiness !== 'number' || isNaN(dept.avgReadiness) || dept.avgReadiness < 0 || dept.avgReadiness > 100) {
          errors[`dept.${dKey}.avgReadiness`] = 'Readiness must be between 0% and 100%.';
        }
        if (typeof dept.placedCount !== 'number' || isNaN(dept.placedCount) || dept.placedCount < 0) {
          errors[`dept.${dKey}.placedCount`] = 'Must be 0 or greater.';
        }
        if (typeof dept.interningCount !== 'number' || isNaN(dept.interningCount) || dept.interningCount < 0) {
          errors[`dept.${dKey}.interningCount`] = 'Must be 0 or greater.';
        }
        if (typeof dept.placementRate !== 'number' || isNaN(dept.placementRate) || dept.placementRate < 0 || dept.placementRate > 100) {
          errors[`dept.${dKey}.placementRate`] = 'Placement % must be between 0 and 100.';
        }
      });
    }

    // 3. Pipeline validation
    if (data?.placementPipeline) {
      if (data.placementPipeline.placementRateBenchmark !== undefined) {
        const rate = data.placementPipeline.placementRateBenchmark;
        if (typeof rate !== 'number' || isNaN(rate) || rate < 0 || rate > 100) {
          errors['pipeline.placementRateBenchmark'] = 'Benchmark must be between 0% and 100%.';
        }
      }
      if (data.placementPipeline.internshipApplications !== undefined) {
        const apps = data.placementPipeline.internshipApplications;
        if (typeof apps !== 'number' || isNaN(apps) || apps < 0) {
          errors['pipeline.internshipApplications'] = 'Applications must be 0 or greater.';
        }
      }
      if (data.placementPipeline.placementOffers !== undefined) {
        const offers = data.placementPipeline.placementOffers;
        if (typeof offers !== 'number' || isNaN(offers) || offers < 0) {
          errors['pipeline.placementOffers'] = 'Offers must be 0 or greater.';
        }
      }
    }

    // 4. Corporate partner counts
    if (data?.corporatePartners && (typeof data.corporatePartners.totalPartners !== 'number' || isNaN(data.corporatePartners.totalPartners) || data.corporatePartners.totalPartners < 0)) {
      errors['corporate.totalPartners'] = 'Partners must be 0 or greater.';
    }

    return errors;
  };

  const clearError = (key: string) => {
    if (validationErrors[key]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  // Handle immediate text typing for Institution Details
  const handleInstitutionChange = (field: keyof typeof formData.institution, value: string) => {
    clearError(`institution.${field}`);
    setFormData((prev) => ({
      ...prev,
      institution: {
        ...prev.institution,
        [field]: value,
        // Immediately clear stale registry metadata when typing a new search
        ...(field === 'name' ? {
          city: '',
          state: '',
          country: 'India',
          countryCode: 'IN',
          institutionId: '',
          institutionType: '',
          dataType: 'Custom'
        } : {})
      }
    }));
    if (field === 'name') {
      triggerInstitutionSearch(value);
    }
  };

  // Handle immediate typing for Department fields (code, name, counts, readiness, gaps)
  const handleDepartmentChange = (
    deptKey: string,
    field: keyof DepartmentMetric,
    value: string | number
  ) => {
    clearError(`dept.${deptKey}.${field}`);
    setFormData((prev) => {
      const currentDept = prev.departments[deptKey];
      if (!currentDept) return prev;

      let parsedValue: any = value;
      if (typeof currentDept[field] === 'number') {
        const num = Number(value);
        parsedValue = isNaN(num) ? 0 : Math.max(0, num);
      }

      const updatedDept = {
        ...currentDept,
        [field]: parsedValue
      };

      // Auto-compute placementRate if placedCount or totalStudents change and placementRate was not directly targeted
      if (field === 'placedCount' || field === 'totalStudents') {
        const eligible = Math.round(Number(field === 'totalStudents' ? parsedValue : currentDept.totalStudents) * 0.28);
        const placed = Number(field === 'placedCount' ? parsedValue : currentDept.placedCount);
        if (eligible > 0) {
          updatedDept.placementRate = Math.min(100, Math.round((placed / eligible) * 100));
        }
      }

      // Auto-compute internshipRate if interningCount or totalStudents change
      if (field === 'interningCount' || field === 'totalStudents') {
        const eligible = Math.round(Number(field === 'totalStudents' ? parsedValue : currentDept.totalStudents) * 0.7);
        const interning = Number(field === 'interningCount' ? parsedValue : currentDept.interningCount);
        if (eligible > 0) {
          updatedDept.internshipRate = Math.min(100, Math.round((interning / eligible) * 100));
        }
      }

      return {
        ...prev,
        departments: {
          ...prev.departments,
          [deptKey]: updatedDept
        }
      };
    });
  };

  // Add a new department
  const handleAddDepartment = () => {
    if (!newDeptForm.code.trim() || !newDeptForm.name.trim()) {
      addNotification('Please enter both Department Code and Name.', 'warning');
      return;
    }
    const key = newDeptForm.code.trim().toUpperCase();
    if (formData.departments[key]) {
      addNotification(`Department ${key} already exists.`, 'warning');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      departments: {
        ...prev.departments,
        [key]: {
          ...newDeptForm,
          code: key
        }
      }
    }));
    setShowAddDeptModal(false);
    setNewDeptForm({
      code: '',
      name: '',
      totalStudents: 180,
      avgReadiness: 75,
      placementRate: 70,
      internshipRate: 65,
      placedCount: 35,
      interningCount: 78,
      majorGap: 'Full Stack & Cloud Tools'
    });
    addNotification(`Department ${key} added to working data. Click "Save & Update Dashboard" to apply.`, 'info');
  };

  // Remove a department
  const handleRemoveDepartment = (deptKey: string) => {
    if (Object.keys(formData.departments).length <= 1) {
      addNotification('At least one department must remain configured.', 'warning');
      return;
    }
    setFormData((prev) => {
      const copy = { ...prev.departments };
      delete copy[deptKey];
      return {
        ...prev,
        departments: copy
      };
    });
  };

  // Handle immediate typing for Placement & Pipeline Parameters
  const handlePipelineChange = (field: keyof PlacementPipelineConfig, value: any) => {
    clearError(`pipeline.${field}`);
    setFormData((prev) => {
      const currentPipeline = prev.placementPipeline || { ...DEFAULT_PLACEMENT_PIPELINE };
      return {
        ...prev,
        placementPipeline: {
          ...currentPipeline,
          [field]: value
        },
        ...(field === 'internshipApplications' ? { internshipApplicationsOverride: Number(value) } : {})
      };
    });
  };

  // Handle immediate typing for Corporate Partner metrics
  const handleCorporateChange = (field: keyof typeof formData.corporatePartners, value: any) => {
    clearError(`corporate.${field}`);
    setFormData((prev) => ({
      ...prev,
      corporatePartners: {
        ...prev.corporatePartners,
        [field]: value
      }
    }));
  };

  // Add a hiring role chip
  const handleAddHiringRole = () => {
    if (!newRoleInput.trim()) return;
    if (formData.corporatePartners.topHiringRoles.includes(newRoleInput.trim())) return;
    setFormData((prev) => ({
      ...prev,
      corporatePartners: {
        ...prev.corporatePartners,
        topHiringRoles: [...prev.corporatePartners.topHiringRoles, newRoleInput.trim()]
      }
    }));
    setNewRoleInput('');
  };

  // Remove a hiring role chip
  const handleRemoveHiringRole = (roleToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      corporatePartners: {
        ...prev.corporatePartners,
        topHiringRoles: prev.corporatePartners.topHiringRoles.filter((r) => r !== roleToRemove)
      }
    }));
  };

  // Save changes globally to context and persist in browser storage
  const handleSave = () => {
    const errors = validate(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      const firstErrorMsg = Object.values(errors)[0];
      addNotification(`Validation notice: ${firstErrorMsg}`, 'warning');
      return;
    }

    setValidationErrors({});
    updateCollegeAdminConfig(formData);
    setHasChanges(false);
  };

  // Discard all unsaved edits and restore last saved configuration
  const handleCancel = () => {
    setFormData({
      institution: { ...(collegeAdminConfig?.institution || DEFAULT_COLLEGE_CONFIG.institution) },
      departments: JSON.parse(JSON.stringify(collegeAdminConfig?.departments || DEFAULT_COLLEGE_CONFIG.departments)),
      corporatePartners: {
        ...(collegeAdminConfig?.corporatePartners || DEFAULT_COLLEGE_CONFIG.corporatePartners),
        topHiringRoles: Array.isArray(collegeAdminConfig?.corporatePartners?.topHiringRoles)
          ? [...collegeAdminConfig.corporatePartners.topHiringRoles]
          : [...DEFAULT_COLLEGE_CONFIG.corporatePartners.topHiringRoles]
      },
      placementPipeline: collegeAdminConfig?.placementPipeline
        ? { ...collegeAdminConfig.placementPipeline }
        : { ...DEFAULT_PLACEMENT_PIPELINE },
      internshipApplicationsOverride: collegeAdminConfig?.internshipApplicationsOverride ?? 890,
      isCustomized: Boolean(collegeAdminConfig?.isCustomized),
      lastUpdated: collegeAdminConfig?.lastUpdated
    });
    setShowDropdown(false);
    setIsSearching(false);
    setValidationErrors({});
    setHasChanges(false);
    addNotification('Unsaved edits discarded. Restored last saved data.', 'info');
  };

  // Reset to baseline sample data
  const handleResetToSample = () => {
    resetCollegeAdminConfig();
    setShowDropdown(false);
    setIsSearching(false);
    setShowResetConfirm(false);
    setValidationErrors({});
    setHasChanges(false);
  };

  // Navigation safeguard when changes exist
  const handleNavigateAway = () => {
    if (hasChanges) {
      setShowExitConfirm(true);
    } else {
      if (onBackToDashboard) onBackToDashboard();
      else setActiveTab('college-dashboard');
    }
  };

  // Aggregated preview stats computed from working copy
  const deptsList = Object.values(formData.departments || {});
  const totalEnrolled = deptsList.reduce((acc, d) => acc + (d?.totalStudents || 0), 0);
  const totalPlacedCount = deptsList.reduce((acc, d) => acc + (d?.placedCount || 0), 0);
  const weightedReadinessSum = deptsList.reduce(
    (acc, d) => acc + (d?.avgReadiness || 0) * (d?.totalStudents || 0),
    0
  );
  const overallAvgReadiness = totalEnrolled > 0 ? Math.round(weightedReadinessSum / totalEnrolled) : 76;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-28">
      {/* 1. Header & Title with Status Indicators */}
      <div className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <button
              onClick={handleNavigateAway}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              Manage Institutional Data
            </h1>

            {/* Unsaved Changes Header Badge */}
            {hasChanges ? (
              <span className="text-[11px] font-bold px-3 py-1 rounded-full border bg-amber-500/20 text-amber-300 border-amber-500/30 flex items-center gap-1.5 animate-pulse">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                Unsaved changes ({modifiedSectionsList.length} section{modifiedSectionsList.length > 1 ? 's' : ''})
              </span>
            ) : !collegeAdminConfig.isCustomized ? (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-emerald-500/20 text-emerald-300 border-emerald-500/30 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Sample Data
              </span>
            ) : null}
          </div>
          <p className="text-xs text-slate-400">
            Click into any field below to edit immediately. Dashboard updates globally when{' '}
            <strong className="text-indigo-300 font-semibold">&quot;Save &amp; Update Dashboard&quot;</strong> is clicked.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
            title="Reset all values to baseline demo data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset to Sample Data</span>
          </button>
          <button
            onClick={handleNavigateAway}
            className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Dashboard</span>
          </button>
        </div>
      </div>

      {/* 2. Real-time Summary Stat Chips (Reflects local formData immediately) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Students</span>
            <div className="text-lg font-bold text-white mt-0.5">{totalEnrolled.toLocaleString()}</div>
          </div>
          <Users className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Overall Readiness</span>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">{overallAvgReadiness}%</div>
          </div>
          <Award className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Placed</span>
            <div className="text-lg font-bold text-purple-400 mt-0.5">{totalPlacedCount}</div>
          </div>
          <CheckCircle2 className="w-4 h-4 text-purple-400" />
        </div>
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">MoU Partners</span>
            <div className="text-lg font-bold text-amber-400 mt-0.5">{formData.corporatePartners.totalPartners}</div>
          </div>
          <Building2 className="w-4 h-4 text-amber-400" />
        </div>
      </div>

      {/* 3. Section Filter Tabs with Unsaved Edits Dot Indicator */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'all', label: 'All Sections', hasDot: hasChanges },
          { id: 'institution', label: '1. Institution Details', hasDot: isInstitutionModified },
          { id: 'departments', label: '2. Department Student Counts & Readiness', hasDot: isDepartmentsModified },
          { id: 'pipeline', label: '3. Placement & Internships', hasDot: isPipelineModified },
          { id: 'partners', label: '4. Corporate Partners', hasDot: isPartnersModified }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubSection(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5 ${
              activeSubSection === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            {tab.hasDot && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Contains unsaved edits" />
            )}
          </button>
        ))}
      </div>

      {/* SECTION 1: Institution Details */}
      {(activeSubSection === 'all' || activeSubSection === 'institution') && (
        <div className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <School className="w-4 h-4 text-indigo-400" />
                Institution Details & Metadata
              </h2>
              <p className="text-xs text-slate-400">
                Official institutional identity displayed across student dashboards and reports. Click and type directly.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isInstitutionModified && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/30">
                  Modified
                </span>
              )}
              {!collegeAdminConfig.isCustomized && (
                <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                  Sample Data
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Institution Name Autocomplete Search Field */}
            <div className="sm:col-span-2 relative" ref={dropdownRef}>
              {/* Hierarchical Location Filter Bar (Country -> State -> City) */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2 mb-3">
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span className="font-semibold flex items-center gap-1.5 text-indigo-400">
                    <MapPin className="w-3.5 h-3.5" />
                    Location Filter (Optional)
                  </span>
                  {(filterCountry !== 'India' || filterState !== 'ALL' || filterCity !== 'ALL') && (
                    <button
                      type="button"
                      onClick={() => {
                        setFilterCountry('India');
                        setFilterState('ALL');
                        setFilterCity('ALL');
                        triggerInstitutionSearch(formData.institution.name, 'India', 'ALL', 'ALL');
                      }}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 underline font-medium"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Country Filter */}
                  <div>
                    <label className="text-[10px] text-slate-400 font-medium block mb-1">Country</label>
                    <select
                      value={filterCountry}
                      onChange={(e) => {
                        const newCountry = e.target.value;
                        setFilterCountry(newCountry);
                        setFilterState('ALL');
                        setFilterCity('ALL');
                        triggerInstitutionSearch(formData.institution.name, newCountry, 'ALL', 'ALL');
                      }}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="India">🇮🇳 India</option>
                      <option value="ALL">🌐 All Countries</option>
                    </select>
                  </div>

                  {/* State Filter */}
                  <div>
                    <label className="text-[10px] text-slate-400 font-medium block mb-1">State / UT</label>
                    <select
                      value={filterState}
                      onChange={(e) => {
                        const newState = e.target.value;
                        setFilterState(newState);
                        setFilterCity('ALL');
                        triggerInstitutionSearch(formData.institution.name, filterCountry, newState, 'ALL');
                      }}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="ALL">All States</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* City Filter */}
                  <div>
                    <label className="text-[10px] text-slate-400 font-medium block mb-1">City</label>
                    <select
                      value={filterCity}
                      onChange={(e) => {
                        const newCity = e.target.value;
                        setFilterCity(newCity);
                        triggerInstitutionSearch(formData.institution.name, filterCountry, filterState, newCity);
                      }}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="ALL">All Cities</option>
                      {availableCities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <label className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span>Institution Name</span>
                  <span className="text-[10px] text-indigo-400 font-normal">
                    (Indian College &amp; University Search)
                  </span>
                </span>
                {formData.institution.name !== collegeAdminConfig.institution.name && (
                  <span className="text-[9px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                    Modified
                  </span>
                )}
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={formData.institution.name}
                  onChange={(e) => handleInstitutionChange('name', e.target.value)}
                  onFocus={() => {
                    if (formData.institution.name.trim().length >= 2 || filterState !== 'ALL' || filterCity !== 'ALL') {
                      setShowDropdown(true);
                      if (searchResults.length === 0 && !searchHasRun) {
                        triggerInstitutionSearch(formData.institution.name);
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setShowDropdown(false);
                    }
                  }}
                  className={`w-full bg-slate-950/90 rounded-xl pl-9 pr-9 py-2 text-xs text-white focus:outline-none transition-all ${
                    validationErrors['institution.name']
                      ? 'border border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30'
                      : formData.institution.name !== collegeAdminConfig.institution.name
                      ? 'border border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/30'
                      : 'border border-slate-700/80 hover:border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                  }`}
                  placeholder="Type Indian institution name (e.g. MIT, IIT Bombay, MIT Alandi, Pune, VIT...)"
                  autoComplete="off"
                />

                <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
                  {isSearching ? (
                    <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                  ) : formData.institution.name ? (
                    <button
                      type="button"
                      onClick={() => {
                        handleInstitutionChange('name', '');
                        setSearchResults([]);
                        setShowDropdown(false);
                      }}
                      className="text-slate-400 hover:text-white transition p-0.5 rounded"
                      title="Clear field"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Validation error */}
              {validationErrors['institution.name'] && (
                <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {validationErrors['institution.name']}
                </p>
              )}

              {/* Autocomplete Dropdown List */}
              {showDropdown && (formData.institution.name.trim().length >= 2 || filterState !== 'ALL' || filterCity !== 'ALL') && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-slate-900/98 backdrop-blur-xl border border-slate-700/90 rounded-xl shadow-2xl max-h-80 overflow-y-auto divide-y divide-slate-800/80">
                  {/* Dropdown Header */}
                  <div className="px-3 py-2 bg-slate-950/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Globe className="w-3 h-3 text-indigo-400" />
                      Global Higher Education Registry (India)
                    </span>
                    {isSearching ? (
                      <span className="text-indigo-400 flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Searching Indian institutions...
                      </span>
                    ) : (
                      <span className="text-slate-400">{searchResults.length} Indian matches found</span>
                    )}
                  </div>

                  {/* Loading State */}
                  {isSearching && searchResults.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                      <p>Searching Indian university &amp; college database...</p>
                    </div>
                  )}

                  {/* No Results Empty State */}
                  {!isSearching && searchResults.length === 0 && searchHasRun && (
                    <div className="p-3.5 text-center text-xs text-slate-400 space-y-2">
                      <p className="font-semibold text-slate-300">
                        No matching Indian institution found.
                      </p>
                      <p className="text-[11px] text-slate-400">
                        You can keep this as a custom institution name or refine your search.
                      </p>
                      {formData.institution.name.trim() && (
                        <button
                          type="button"
                          onClick={handleUseCustomInstitution}
                          className="px-3 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Use custom institution name &quot;{formData.institution.name}&quot;
                        </button>
                      )}
                    </div>
                  )}

                  {/* Results List */}
                  {searchResults.slice(0, resultLimit).map((inst, idx) => (
                    <div
                      key={inst.id || `${inst.name}-${idx}`}
                      onClick={() => handleSelectInstitution(inst)}
                      className="p-3 hover:bg-indigo-600/20 hover:border-indigo-500/40 border border-transparent cursor-pointer transition flex items-start justify-between gap-3 group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white group-hover:text-indigo-200 transition">
                            {inst.name}
                          </span>
                          {/* Institution Type and Acronym Chips side by side */}
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-800 text-indigo-300 border border-slate-700">
                              {inst.institutionType || 'Institute'}
                            </span>
                            {inst.acronym && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                                [{inst.acronym}]
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                          <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                          <span>
                            {[inst.city, inst.state, inst.country || 'India'].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono inline-flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          ROR Verified
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Show More Button if more than resultLimit */}
                  {searchResults.length > resultLimit && (
                    <div className="p-2 text-center bg-slate-950/60 border-t border-slate-800/80">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setResultLimit((prev) => prev + 10);
                        }}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold py-1 px-3 rounded hover:bg-slate-900 transition"
                      >
                        Show more ({searchResults.length - resultLimit} remaining)
                      </button>
                    </div>
                  )}

                  {/* Dropdown Footer Options: Custom Institution & Close */}
                  <div className="p-2.5 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    {formData.institution.name.trim() ? (
                      <button
                        type="button"
                        onClick={handleUseCustomInstitution}
                        className="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 hover:underline text-[11px]"
                      >
                        <Plus className="w-3 h-3" />
                        Use custom institution name &quot;{formData.institution.name.trim()}&quot;
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500">Click any result to select</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowDropdown(false)}
                      className="text-[11px] text-slate-400 hover:text-slate-200"
                    >
                      Close (Esc)
                    </button>
                  </div>
                </div>
              )}

              {/* Selected Institution Verified Location & Metadata Strip */}
              {Boolean(formData.institution.city || formData.institution.state || formData.institution.institutionId) && (
                <div className="mt-2 text-xs bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-slate-300">
                  <div className="flex items-center gap-2 flex-wrap">
                    {formData.institution.institutionId ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Registry Verified:
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-400 font-medium text-[11px]">
                        Custom Institution:
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[11px] text-slate-200">
                      <MapPin className="w-3 h-3 text-indigo-400" />
                      {[formData.institution.city, formData.institution.state, formData.institution.country || 'India'].filter(Boolean).join(', ')}
                    </span>
                    {formData.institution.institutionType && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                        {formData.institution.institutionType}
                      </span>
                    )}
                  </div>
                  {formData.institution.institutionId && (
                    <span className="text-[10px] text-slate-400 font-mono" title={formData.institution.institutionId}>
                      ID: {formData.institution.institutionId.replace('https://ror.org/', 'ROR: ')}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Short Code / Acronym */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Short Code / Acronym</span>
                {formData.institution.shortCode !== collegeAdminConfig.institution.shortCode && (
                  <span className="text-[9px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                    Modified
                  </span>
                )}
              </label>
              <input
                type="text"
                value={formData.institution.shortCode}
                onChange={(e) => handleInstitutionChange('shortCode', e.target.value)}
                className={`w-full bg-slate-950/90 font-mono rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-all ${
                  validationErrors['institution.shortCode']
                    ? 'border border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30'
                    : formData.institution.shortCode !== collegeAdminConfig.institution.shortCode
                    ? 'border border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/30'
                    : 'border border-slate-700/80 hover:border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                }`}
                placeholder="e.g. PIT"
              />
              {validationErrors['institution.shortCode'] && (
                <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {validationErrors['institution.shortCode']}
                </p>
              )}
            </div>

            {/* Academic Year */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Academic Year</span>
                {formData.institution.academicYear !== collegeAdminConfig.institution.academicYear && (
                  <span className="text-[9px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                    Modified
                  </span>
                )}
              </label>
              <input
                type="text"
                value={formData.institution.academicYear}
                onChange={(e) => handleInstitutionChange('academicYear', e.target.value)}
                className={`w-full bg-slate-950/90 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-all ${
                  formData.institution.academicYear !== collegeAdminConfig.institution.academicYear
                    ? 'border border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/30'
                    : 'border border-slate-700/80 hover:border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                }`}
                placeholder="e.g. 2026-27"
              />
            </div>

            {/* Placement Cell Name */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Placement Cell Name</span>
                {formData.institution.placementCell !== collegeAdminConfig.institution.placementCell && (
                  <span className="text-[9px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                    Modified
                  </span>
                )}
              </label>
              <input
                type="text"
                value={formData.institution.placementCell}
                onChange={(e) => handleInstitutionChange('placementCell', e.target.value)}
                className={`w-full bg-slate-950/90 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-all ${
                  formData.institution.placementCell !== collegeAdminConfig.institution.placementCell
                    ? 'border border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/30'
                    : 'border border-slate-700/80 hover:border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                }`}
                placeholder="e.g. Training & Placement Cell"
              />
            </div>

            {/* Accreditation & Approvals */}
            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Accreditation & Approvals</span>
                {formData.institution.accreditation !== collegeAdminConfig.institution.accreditation && (
                  <span className="text-[9px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                    Modified
                  </span>
                )}
              </label>
              <input
                type="text"
                value={formData.institution.accreditation}
                onChange={(e) => handleInstitutionChange('accreditation', e.target.value)}
                className={`w-full bg-slate-950/90 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-all ${
                  formData.institution.accreditation !== collegeAdminConfig.institution.accreditation
                    ? 'border border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/30'
                    : 'border border-slate-700/80 hover:border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                }`}
                placeholder="e.g. NAAC Accredited • AICTE Approved"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Department Student Counts & Readiness Values */}
      {(activeSubSection === 'all' || activeSubSection === 'departments') && (
        <div className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  Department Student Counts, Readiness & Placements
                </h2>
                {isDepartmentsModified && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/30">
                    Modified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                All fields enter edit mode immediately when clicked. Edit code, department name, strength, readiness index, and placement counts.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-slate-400">
                Total Enrolled: <strong className="text-white font-mono">{totalEnrolled}</strong>
              </div>
              <button
                onClick={() => setShowAddDeptModal(true)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Department</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-y border-slate-800">
                <tr>
                  <th className="py-3 px-3 w-48">Dept Code & Name</th>
                  <th className="py-3 px-3 w-28">Students</th>
                  <th className="py-3 px-3 w-28">Readiness (%)</th>
                  <th className="py-3 px-3 w-24">Placed</th>
                  <th className="py-3 px-3 w-24">Interning</th>
                  <th className="py-3 px-3 w-24">Placement %</th>
                  <th className="py-3 px-3">Major Skill Gap</th>
                  <th className="py-3 px-2 text-center w-12">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {Object.entries(formData.departments).map(([dKey, dept]) => {
                  const origDept = collegeAdminConfig.departments[dKey];
                  const isDeptNameMod = origDept && (dept.code !== origDept.code || dept.name !== origDept.name);
                  const isStudentsMod = origDept && dept.totalStudents !== origDept.totalStudents;
                  const isReadinessMod = origDept && dept.avgReadiness !== origDept.avgReadiness;
                  const isPlacedMod = origDept && dept.placedCount !== origDept.placedCount;
                  const isInterningMod = origDept && dept.interningCount !== origDept.interningCount;
                  const isPlacementRateMod = origDept && dept.placementRate !== origDept.placementRate;
                  const isGapMod = origDept && dept.majorGap !== origDept.majorGap;

                  return (
                    <tr key={dKey} className="hover:bg-slate-950/40 transition">
                      {/* Dept Code & Name */}
                      <td className="py-2.5 px-3 space-y-1">
                        <div className="relative">
                          <input
                            type="text"
                            value={dept.code}
                            onChange={(e) => handleDepartmentChange(dKey, 'code', e.target.value.toUpperCase())}
                            className={`w-full bg-slate-950/90 rounded-lg px-2 py-1 text-xs text-white font-bold uppercase focus:outline-none ${
                              validationErrors[`dept.${dKey}.code`]
                                ? 'border border-rose-500'
                                : isDeptNameMod
                                ? 'border border-amber-500/70'
                                : 'border border-slate-700/80 focus:border-indigo-500'
                            }`}
                            placeholder="e.g. CSE"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={dept.name}
                            onChange={(e) => handleDepartmentChange(dKey, 'name', e.target.value)}
                            className={`w-full bg-slate-950/90 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none ${
                              validationErrors[`dept.${dKey}.name`]
                                ? 'border border-rose-500'
                                : isDeptNameMod
                                ? 'border border-amber-500/70'
                                : 'border border-slate-700/80 focus:border-indigo-500'
                            }`}
                            placeholder="e.g. Computer Science"
                          />
                        </div>
                        {isDeptNameMod && (
                          <span className="text-[9px] text-amber-400 font-semibold block">Modified</span>
                        )}
                        {(validationErrors[`dept.${dKey}.code`] || validationErrors[`dept.${dKey}.name`]) && (
                          <span className="text-[9px] text-rose-400 font-medium block">
                            {validationErrors[`dept.${dKey}.code`] || validationErrors[`dept.${dKey}.name`]}
                          </span>
                        )}
                      </td>

                      {/* Total Students */}
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          min="0"
                          value={dept.totalStudents}
                          onChange={(e) => handleDepartmentChange(dKey, 'totalStudents', e.target.value)}
                          className={`w-full bg-slate-950/90 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none font-mono ${
                            validationErrors[`dept.${dKey}.totalStudents`]
                              ? 'border border-rose-500'
                              : isStudentsMod
                              ? 'border border-amber-500/70'
                              : 'border border-slate-700/80 focus:border-indigo-500'
                          }`}
                        />
                        {isStudentsMod && (
                          <span className="text-[9px] text-amber-400 font-semibold block mt-0.5">Modified</span>
                        )}
                        {validationErrors[`dept.${dKey}.totalStudents`] && (
                          <span className="text-[9px] text-rose-400 block mt-0.5">
                            {validationErrors[`dept.${dKey}.totalStudents`]}
                          </span>
                        )}
                      </td>

                      {/* Readiness % */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={dept.avgReadiness}
                            onChange={(e) => handleDepartmentChange(dKey, 'avgReadiness', e.target.value)}
                            className={`w-full bg-slate-950/90 rounded-lg px-2 py-1 text-xs text-emerald-400 focus:outline-none font-mono ${
                              validationErrors[`dept.${dKey}.avgReadiness`]
                                ? 'border border-rose-500'
                                : isReadinessMod
                                ? 'border border-amber-500/70'
                                : 'border border-slate-700/80 focus:border-indigo-500'
                            }`}
                          />
                          <span className="text-slate-400">%</span>
                        </div>
                        {isReadinessMod && (
                          <span className="text-[9px] text-amber-400 font-semibold block mt-0.5">Modified</span>
                        )}
                        {validationErrors[`dept.${dKey}.avgReadiness`] && (
                          <span className="text-[9px] text-rose-400 block mt-0.5">
                            {validationErrors[`dept.${dKey}.avgReadiness`]}
                          </span>
                        )}
                      </td>

                      {/* Placed */}
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          min="0"
                          value={dept.placedCount}
                          onChange={(e) => handleDepartmentChange(dKey, 'placedCount', e.target.value)}
                          className={`w-full bg-slate-950/90 rounded-lg px-2 py-1 text-xs text-purple-300 focus:outline-none font-mono ${
                            isPlacedMod
                              ? 'border border-amber-500/70'
                              : 'border border-slate-700/80 focus:border-indigo-500'
                          }`}
                        />
                        {isPlacedMod && (
                          <span className="text-[9px] text-amber-400 font-semibold block mt-0.5">Modified</span>
                        )}
                      </td>

                      {/* Interning */}
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          min="0"
                          value={dept.interningCount}
                          onChange={(e) => handleDepartmentChange(dKey, 'interningCount', e.target.value)}
                          className={`w-full bg-slate-950/90 rounded-lg px-2 py-1 text-xs text-blue-300 focus:outline-none font-mono ${
                            isInterningMod
                              ? 'border border-amber-500/70'
                              : 'border border-slate-700/80 focus:border-indigo-500'
                          }`}
                        />
                        {isInterningMod && (
                          <span className="text-[9px] text-amber-400 font-semibold block mt-0.5">Modified</span>
                        )}
                      </td>

                      {/* Placement % */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={dept.placementRate}
                            onChange={(e) => handleDepartmentChange(dKey, 'placementRate', e.target.value)}
                            className={`w-full bg-slate-950/90 rounded-lg px-2 py-1 text-xs text-purple-400 focus:outline-none font-mono ${
                              isPlacementRateMod
                                ? 'border border-amber-500/70'
                                : 'border border-slate-700/80 focus:border-indigo-500'
                            }`}
                          />
                          <span className="text-slate-400">%</span>
                        </div>
                        {isPlacementRateMod && (
                          <span className="text-[9px] text-amber-400 font-semibold block mt-0.5">Modified</span>
                        )}
                      </td>

                      {/* Major Skill Gap */}
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={dept.majorGap}
                          onChange={(e) => handleDepartmentChange(dKey, 'majorGap', e.target.value)}
                          className={`w-full bg-slate-950/90 rounded-lg px-2.5 py-1 text-xs text-amber-300 focus:outline-none ${
                            isGapMod
                              ? 'border border-amber-500/70'
                              : 'border border-slate-700/80 focus:border-indigo-500'
                          }`}
                          placeholder="e.g. TypeScript & Cloud Native"
                        />
                        {isGapMod && (
                          <span className="text-[9px] text-amber-400 font-semibold block mt-0.5">Modified</span>
                        )}
                      </td>

                      {/* Delete Action */}
                      <td className="py-2.5 px-2 text-center">
                        <button
                          onClick={() => handleRemoveDepartment(dKey)}
                          disabled={Object.keys(formData.departments).length <= 1}
                          className={`p-1.5 rounded-lg transition ${
                            Object.keys(formData.departments).length <= 1
                              ? 'text-slate-600 cursor-not-allowed'
                              : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
                          }`}
                          title="Delete Department"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: Internship Applications & Placement Pipeline Parameters */}
      {(activeSubSection === 'all' || activeSubSection === 'pipeline') && (
        <div className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  Internship & Placement Pipeline Parameters
                </h2>
                {isPipelineModified && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/30">
                    Modified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Adjust campus drive application volumes, package metrics, and placement benchmarks. All inputs edit immediately.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
              Pipeline Funnel
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Total Internship Applications */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Total Internship Applications</span>
                {formData.placementPipeline?.internshipApplications !== (collegeAdminConfig.placementPipeline?.internshipApplications ?? 890) && (
                  <span className="text-[9px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                    Modified
                  </span>
                )}
              </label>
              <input
                type="number"
                min="0"
                value={formData.placementPipeline?.internshipApplications ?? 890}
                onChange={(e) =>
                  handlePipelineChange('internshipApplications', Math.max(0, Number(e.target.value)))
                }
                className={`w-full bg-slate-950/90 rounded-xl px-3 py-2 text-xs text-blue-300 focus:outline-none font-mono transition-all ${
                  formData.placementPipeline?.internshipApplications !== (collegeAdminConfig.placementPipeline?.internshipApplications ?? 890)
                    ? 'border border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/30'
                    : 'border border-slate-700/80 hover:border-slate-600 focus:border-indigo-500'
                }`}
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Total student submissions across all recruitment drives
              </span>
            </div>

            {/* Placement Drive Offers Received */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Placement Drive Offers Received</span>
                {formData.placementPipeline?.placementOffers !== collegeAdminConfig.placementPipeline?.placementOffers && (
                  <span className="text-[9px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                    Modified
                  </span>
                )}
              </label>
              <input
                type="number"
                min="0"
                value={formData.placementPipeline?.placementOffers ?? totalPlacedCount}
                onChange={(e) =>
                  handlePipelineChange('placementOffers', Math.max(0, Number(e.target.value)))
                }
                className={`w-full bg-slate-950/90 rounded-xl px-3 py-2 text-xs text-purple-300 focus:outline-none font-mono transition-all ${
                  formData.placementPipeline?.placementOffers !== collegeAdminConfig.placementPipeline?.placementOffers
                    ? 'border border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/30'
                    : 'border border-slate-700/80 hover:border-slate-600 focus:border-indigo-500'
                }`}
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Total letters of offer issued by campus recruiters
              </span>
            </div>

            {/* Placement Benchmark Rate (%) */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Placement Benchmark Rate (%)</span>
                {formData.placementPipeline?.placementRateBenchmark !== (collegeAdminConfig.placementPipeline?.placementRateBenchmark ?? 76) && (
                  <span className="text-[9px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                    Modified
                  </span>
                )}
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.placementPipeline?.placementRateBenchmark ?? 76}
                onChange={(e) =>
                  handlePipelineChange('placementRateBenchmark', Math.min(100, Math.max(0, Number(e.target.value))))
                }
                className={`w-full bg-slate-950/90 rounded-xl px-3 py-2 text-xs text-emerald-300 focus:outline-none font-mono transition-all ${
                  formData.placementPipeline?.placementRateBenchmark !== (collegeAdminConfig.placementPipeline?.placementRateBenchmark ?? 76)
                    ? 'border border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/30'
                    : 'border border-slate-700/80 hover:border-slate-600 focus:border-indigo-500'
                }`}
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Target institutional placement percentage
              </span>
            </div>

            {/* Average Salary Package (CTC) */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Average Salary Package (CTC)</span>
                {formData.placementPipeline?.averagePackage !== (collegeAdminConfig.placementPipeline?.averagePackage ?? '7.8 LPA') && (
                  <span className="text-[9px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                    Modified
                  </span>
                )}
              </label>
              <input
                type="text"
                value={formData.placementPipeline?.averagePackage ?? '7.8 LPA'}
                onChange={(e) => handlePipelineChange('averagePackage', e.target.value)}
                className={`w-full bg-slate-950/90 rounded-xl px-3 py-2 text-xs text-emerald-400 focus:outline-none transition-all ${
                  formData.placementPipeline?.averagePackage !== (collegeAdminConfig.placementPipeline?.averagePackage ?? '7.8 LPA')
                    ? 'border border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/30'
                    : 'border border-slate-700/80 hover:border-slate-600 focus:border-indigo-500'
                }`}
                placeholder="e.g. 8.2 LPA"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Mean compensation across all hired graduates
              </span>
            </div>

            {/* Highest Salary Package (CTC) */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Highest Salary Package (CTC)</span>
                {formData.placementPipeline?.highestPackage !== (collegeAdminConfig.placementPipeline?.highestPackage ?? '34.5 LPA') && (
                  <span className="text-[9px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                    Modified
                  </span>
                )}
              </label>
              <input
                type="text"
                value={formData.placementPipeline?.highestPackage ?? '34.5 LPA'}
                onChange={(e) => handlePipelineChange('highestPackage', e.target.value)}
                className={`w-full bg-slate-950/90 rounded-xl px-3 py-2 text-xs text-purple-400 focus:outline-none transition-all ${
                  formData.placementPipeline?.highestPackage !== (collegeAdminConfig.placementPipeline?.highestPackage ?? '34.5 LPA')
                    ? 'border border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/30'
                    : 'border border-slate-700/80 hover:border-slate-600 focus:border-indigo-500'
                }`}
                placeholder="e.g. 42.0 LPA"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Top corporate offer received in current placement season
              </span>
            </div>

            {/* Active Campus Placement Drives */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Active Campus Placement Drives</span>
                {formData.placementPipeline?.activePlacementDrives !== (collegeAdminConfig.placementPipeline?.activePlacementDrives ?? 28) && (
                  <span className="text-[9px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                    Modified
                  </span>
                )}
              </label>
              <input
                type="number"
                min="0"
                value={formData.placementPipeline?.activePlacementDrives ?? 28}
                onChange={(e) =>
                  handlePipelineChange('activePlacementDrives', Math.max(0, Number(e.target.value)))
                }
                className={`w-full bg-slate-950/90 rounded-xl px-3 py-2 text-xs text-indigo-300 focus:outline-none font-mono transition-all ${
                  formData.placementPipeline?.activePlacementDrives !== (collegeAdminConfig.placementPipeline?.activePlacementDrives ?? 28)
                    ? 'border border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/30'
                    : 'border border-slate-700/80 hover:border-slate-600 focus:border-indigo-500'
                }`}
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Number of scheduled corporate recruitment drives
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: Corporate Partner Counts & Hiring Profiles */}
      {(activeSubSection === 'all' || activeSubSection === 'partners') && (
        <div className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  Corporate Partners & Industry Collaborations
                </h2>
                {isPartnersModified && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/30">
                    Modified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage partner industry counts, active recruiters, and key hiring roles. All fields editable immediately.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
              Corporate Portal
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Total Partner Companies (MoU)</span>
                {formData.corporatePartners.totalPartners !== collegeAdminConfig.corporatePartners.totalPartners && (
                  <span className="text-[9px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                    Modified
                  </span>
                )}
              </label>
              <input
                type="number"
                min="0"
                value={formData.corporatePartners.totalPartners}
                onChange={(e) =>
                  handleCorporateChange('totalPartners', Math.max(0, Number(e.target.value)))
                }
                className={`w-full bg-slate-950/90 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono transition-all ${
                  formData.corporatePartners.totalPartners !== collegeAdminConfig.corporatePartners.totalPartners
                    ? 'border border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/30'
                    : 'border border-slate-700/80 hover:border-slate-600 focus:border-indigo-500'
                }`}
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Active Hiring Partners</span>
                {formData.corporatePartners.activeHiringPartners !== collegeAdminConfig.corporatePartners.activeHiringPartners && (
                  <span className="text-[9px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                    Modified
                  </span>
                )}
              </label>
              <input
                type="number"
                min="0"
                value={formData.corporatePartners.activeHiringPartners}
                onChange={(e) =>
                  handleCorporateChange('activeHiringPartners', Math.max(0, Number(e.target.value)))
                }
                className={`w-full bg-slate-950/90 rounded-xl px-3 py-2 text-xs text-indigo-300 focus:outline-none font-mono transition-all ${
                  formData.corporatePartners.activeHiringPartners !== collegeAdminConfig.corporatePartners.activeHiringPartners
                    ? 'border border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/30'
                    : 'border border-slate-700/80 hover:border-slate-600 focus:border-indigo-500'
                }`}
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Internship Partner Companies</span>
                {formData.corporatePartners.internshipPartners !== collegeAdminConfig.corporatePartners.internshipPartners && (
                  <span className="text-[9px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                    Modified
                  </span>
                )}
              </label>
              <input
                type="number"
                min="0"
                value={formData.corporatePartners.internshipPartners}
                onChange={(e) =>
                  handleCorporateChange('internshipPartners', Math.max(0, Number(e.target.value)))
                }
                className={`w-full bg-slate-950/90 rounded-xl px-3 py-2 text-xs text-blue-300 focus:outline-none font-mono transition-all ${
                  formData.corporatePartners.internshipPartners !== collegeAdminConfig.corporatePartners.internshipPartners
                    ? 'border border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/30'
                    : 'border border-slate-700/80 hover:border-slate-600 focus:border-indigo-500'
                }`}
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>New Partners This Year</span>
                {formData.corporatePartners.newPartnersThisYear !== collegeAdminConfig.corporatePartners.newPartnersThisYear && (
                  <span className="text-[9px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                    Modified
                  </span>
                )}
              </label>
              <input
                type="number"
                min="0"
                value={formData.corporatePartners.newPartnersThisYear}
                onChange={(e) =>
                  handleCorporateChange('newPartnersThisYear', Math.max(0, Number(e.target.value)))
                }
                className={`w-full bg-slate-950/90 rounded-xl px-3 py-2 text-xs text-amber-300 focus:outline-none font-mono transition-all ${
                  formData.corporatePartners.newPartnersThisYear !== collegeAdminConfig.corporatePartners.newPartnersThisYear
                    ? 'border border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/30'
                    : 'border border-slate-700/80 hover:border-slate-600 focus:border-indigo-500'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span>Top Hiring Job Roles & Profiles</span>
              {JSON.stringify(formData.corporatePartners.topHiringRoles) !== JSON.stringify(collegeAdminConfig.corporatePartners.topHiringRoles) && (
                <span className="text-[9px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                  Modified
                </span>
              )}
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.corporatePartners.topHiringRoles.map((role) => (
                <span
                  key={role}
                  className="px-3 py-1 bg-slate-950 border border-slate-800 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>{role}</span>
                  <button
                    onClick={() => handleRemoveHiringRole(role)}
                    className="text-slate-400 hover:text-rose-400 transition"
                    title="Remove role"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={newRoleInput}
                onChange={(e) => setNewRoleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddHiringRole();
                  }
                }}
                placeholder="Add new hiring role (e.g. AI / ML Systems Engineer)"
                className="flex-1 bg-slate-950/90 border border-slate-700/80 hover:border-slate-600 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
              />
              <button
                onClick={handleAddHiringRole}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Sticky Bottom Action Bar with Unsaved Changes Indicator, Cancel, and Save */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {hasChanges ? (
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <span className="flex items-center gap-1.5 text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Unsaved changes in {modifiedSectionsList.join(', ')}
                </span>
                <span className="hidden lg:inline text-xs text-slate-400">
                  Click &quot;Save &amp; Update Dashboard&quot; to apply across all personas and storage.
                </span>
              </div>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                All changes saved in persistent storage
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCancel}
              disabled={!hasChanges}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                hasChanges
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 cursor-pointer shadow-sm'
                  : 'bg-slate-900/40 text-slate-600 border-slate-800/40 cursor-not-allowed'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`px-5 py-2 rounded-xl text-xs font-semibold shadow-lg transition flex items-center gap-1.5 ${
                hasChanges
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 cursor-pointer'
                  : 'bg-indigo-950/40 text-slate-500 border border-indigo-900/30 cursor-not-allowed shadow-none'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save &amp; Update Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: ADD DEPARTMENT MODAL */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                Add New Department
              </h3>
              <button
                onClick={() => setShowAddDeptModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Department Code (e.g. AIDS)
                </label>
                <input
                  type="text"
                  value={newDeptForm.code}
                  onChange={(e) =>
                    setNewDeptForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white uppercase font-bold focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. AIDS"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  value={newDeptForm.name}
                  onChange={(e) =>
                    setNewDeptForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. AI & Data Science"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Total Students
                </label>
                <input
                  type="number"
                  min="0"
                  value={newDeptForm.totalStudents}
                  onChange={(e) =>
                    setNewDeptForm((prev) => ({ ...prev, totalStudents: Math.max(0, Number(e.target.value)) }))
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Avg Readiness (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newDeptForm.avgReadiness}
                  onChange={(e) =>
                    setNewDeptForm((prev) => ({ ...prev, avgReadiness: Math.min(100, Math.max(0, Number(e.target.value))) }))
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-emerald-400 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Placed Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={newDeptForm.placedCount}
                  onChange={(e) =>
                    setNewDeptForm((prev) => ({ ...prev, placedCount: Math.max(0, Number(e.target.value)) }))
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-purple-300 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Interning Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={newDeptForm.interningCount}
                  onChange={(e) =>
                    setNewDeptForm((prev) => ({ ...prev, interningCount: Math.max(0, Number(e.target.value)) }))
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-blue-300 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Major Skill Gap
                </label>
                <input
                  type="text"
                  value={newDeptForm.majorGap}
                  onChange={(e) =>
                    setNewDeptForm((prev) => ({ ...prev, majorGap: e.target.value }))
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. MLOps & Distributed Computing"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowAddDeptModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDepartment}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Department</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: RESET TO SAMPLE DATA CONFIRMATION */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-2.5 bg-amber-500/20 rounded-xl border border-amber-500/30">
                <RotateCcw className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reset to Default Sample Data?</h3>
                <p className="text-xs text-slate-400 mt-0.5">This will restore standard baseline demo data.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Your customized institution details, department counts, readiness values, and partner numbers will be reset to the original sample dataset.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                Keep Current Data
              </button>
              <button
                onClick={handleResetToSample}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Yes, Reset to Sample Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: UNSAVED CHANGES EXIT CONFIRMATION */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-2.5 bg-amber-500/20 rounded-xl border border-amber-500/30">
                <AlertCircle className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Unsaved Changes Detected</h3>
                <p className="text-xs text-slate-400 mt-0.5">You have edited institutional parameters.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              If you leave now without saving, your working changes in{' '}
              <strong className="text-amber-300">{modifiedSectionsList.join(', ')}</strong> will be lost.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  handleCancel();
                  if (onBackToDashboard) onBackToDashboard();
                  else setActiveTab('college-dashboard');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded-xl text-xs font-semibold transition"
              >
                Discard &amp; Exit
              </button>
              <button
                onClick={() => {
                  const errors = validate(formData);
                  if (Object.keys(errors).length > 0) {
                    setValidationErrors(errors);
                    setShowExitConfirm(false);
                    const first = Object.values(errors)[0];
                    addNotification(`Validation notice: ${first}`, 'warning');
                    return;
                  }
                  setShowExitConfirm(false);
                  handleSave();
                  if (onBackToDashboard) onBackToDashboard();
                  else setActiveTab('college-dashboard');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save &amp; View Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
