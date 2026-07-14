// IDE codes enum
const IdeCode = {
  IDEA_COMMUNITY: 'IDEA-C',
  IDEA_ULTIMATE: 'IDEA-U',
  PYCHARM_PRO: 'PyCharm-P',
  CLION: 'CLion',
  GOLAND: 'Goland',
  RUSTROVER: 'RustRover',
  WEBSTORM: 'WebStorm',
  PHPSTORM: 'PhpStorm',
  ANDROID_STUDIO: 'AndroidStudio'
};

/**
 * Resolves and returns a list of supported IDE codes for a given programming language.
 */
function resolveSupportedIdes(courseLanguage) {
  if (!courseLanguage) {
    console.warn('No course language provided');
    return [IdeCode.IDEA_ULTIMATE, IdeCode.IDEA_COMMUNITY];
  }

  const normalizedLanguage = courseLanguage.trim().toLowerCase().replace('-', '').split(' ')[0];

  switch (normalizedLanguage) {
    case 'java':
    case 'scala':
      return [IdeCode.IDEA_ULTIMATE, IdeCode.IDEA_COMMUNITY];

    case 'python':
      return [
        IdeCode.PYCHARM_PRO,
        IdeCode.IDEA_ULTIMATE,
        IdeCode.IDEA_COMMUNITY,
        IdeCode.CLION,
        IdeCode.RUSTROVER
      ];

    case 'javascript':
      return [
        IdeCode.WEBSTORM,
        IdeCode.IDEA_ULTIMATE,
        IdeCode.PYCHARM_PRO,
        IdeCode.GOLAND,
        IdeCode.PHPSTORM,
        IdeCode.CLION,
        IdeCode.RUSTROVER
      ];

    case 'kotlin':
      return [
        IdeCode.IDEA_ULTIMATE,
        IdeCode.IDEA_COMMUNITY
      ];

    case 'go':
      return [IdeCode.GOLAND, IdeCode.IDEA_ULTIMATE];

    case 'objectivec':
    case 'c++':
      return [IdeCode.CLION];

    case 'rust':
      return [IdeCode.RUSTROVER, IdeCode.CLION, IdeCode.IDEA_ULTIMATE];

    case 'other':
      return [IdeCode.IDEA_ULTIMATE, IdeCode.IDEA_COMMUNITY];

    default:
      console.warn(`Unsupported language: ${courseLanguage}`);
      return [IdeCode.IDEA_ULTIMATE, IdeCode.IDEA_COMMUNITY];
  }
}

/**
 * Generates a Toolbox course opening link.
 */
function generateToolboxCourseOpeningLink(courseId, supportedIdes, studyItemId = null) {
  const url = new URL('jetbrains://educational');
  url.searchParams.append('courseId', courseId.toString());
  url.searchParams.append('source', 'marketplace');
  url.searchParams.append('tools', supportedIdes.join(','));
  url.searchParams.append('minToolVersion', '251');
  url.searchParams.append('minPluginVersion', '2026.6');

  if (studyItemId) {
    url.searchParams.append('study_item_id', studyItemId);
  }
  return url.toString();
}

// Initialize the form
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('courseForm');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const marketplaceIdInput = document.getElementById('marketplaceId');
  const programmingLanguageSelect = document.getElementById('programmingLanguage');
  const toast = document.getElementById('toast');
  const toastLoading = document.getElementById('toastLoading');
  const toastQuestion = document.getElementById('toastQuestion');
  const toastHelp = document.getElementById('toastHelp');
  const toastYesBtn = document.getElementById('toastYesBtn');
  const toastNoBtn = document.getElementById('toastNoBtn');
  const toastClose = document.getElementById('toastClose');

  // Fetch course data from JetBrains API
  async function fetchCourseData(marketplaceId) {
    console.log('Fetching course data for ID:', marketplaceId);
    try {
      // Use CORS proxy to avoid CORS issues
      const apiUrl = `https://plugins.jetbrains.com/api/plugins/${marketplaceId}`;
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`;

      const response = await fetch(proxyUrl);
      console.log('Response status:', response.status);
      if (!response.ok) {
        console.error('Failed to fetch course data, status:', response.status);
        return null;
      }
      const data = await response.json();
      console.log('Course data received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching course data:', error);
      return null;
    }
  }

  // Update preview with course data
  function updatePreview(courseData) {
    console.log('Updating preview with data:', courseData);
    if (!courseData) {
      console.log('No course data to update');
      return;
    }

    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-description');

    console.log('Hero elements found:', { heroTitle, heroDescription });

    if (heroTitle && courseData.name) {
      console.log('Updating title to:', courseData.name);
      heroTitle.textContent = courseData.name;
    }

    if (heroDescription && courseData.description) {
      // Strip HTML tags from description
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = courseData.description;
      const plainText = tempDiv.textContent || tempDiv.innerText || '';
      const truncatedText = plainText.slice(0, 200) + (plainText.length > 200 ? '...' : '');
      console.log('Updating description to:', truncatedText);
      heroDescription.textContent = truncatedText;
    }

    if (courseData.programmingLanguage) {
      console.log('Programming language:', courseData.programmingLanguage);
      // Try to match the programming language with select options
      const options = Array.from(programmingLanguageSelect.options);
      const matchingOption = options.find(opt =>
        opt.value.toLowerCase() === courseData.programmingLanguage.toLowerCase()
      );
      if (matchingOption) {
        console.log('Setting language to:', matchingOption.value);
        programmingLanguageSelect.value = matchingOption.value;
      } else {
        console.log('No matching language option found');
      }
    }
  }

  // Load course data when marketplace ID changes
  let debounceTimer;
  marketplaceIdInput.addEventListener('input', () => {
    console.log('Marketplace ID input changed');
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const marketplaceId = marketplaceIdInput.value.trim();
      console.log('Debounced input, ID:', marketplaceId);
      if (marketplaceId) {
        const courseData = await fetchCourseData(marketplaceId);
        updatePreview(courseData);
      }
    }, 500);
  });

  // Load initial course data
  console.log('Initial marketplace ID:', marketplaceIdInput.value);
  if (marketplaceIdInput.value) {
    fetchCourseData(marketplaceIdInput.value).then(updatePreview);
  }

  // Helper function to generate link from form values
  function generateLinkFromForm() {
    const marketplaceId = document.getElementById('marketplaceId').value;
    const programmingLanguage = document.getElementById('programmingLanguage').value;
    const studyItemId = document.getElementById('studyItemId').value.trim();

    if (!marketplaceId || !programmingLanguage) {
      alert('Please fill in all fields');
      return null;
    }

    const courseNumericId = Number(marketplaceId);
    const supportedIdes = resolveSupportedIdes(programmingLanguage);

    if (supportedIdes.length === 0) {
      alert('No supported IDEs found for this language');
      return null;
    }

    return generateToolboxCourseOpeningLink(courseNumericId, supportedIdes, studyItemId || null);
  }

  // Copy Link button handler
  copyLinkBtn.addEventListener('click', async () => {
    const link = generateLinkFromForm();
    if (!link) return;

    try {
      await navigator.clipboard.writeText(link);

      // Show success feedback
      const originalText = copyLinkBtn.textContent;
      copyLinkBtn.textContent = 'Copied!';
      copyLinkBtn.disabled = true;

      setTimeout(() => {
        copyLinkBtn.textContent = originalText;
        copyLinkBtn.disabled = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      alert('Failed to copy link to clipboard');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const link = generateLinkFromForm();
    if (!link) return;

    // Open the link immediately
    window.location.href = link;

    // Show toast with "Opening course..." immediately
    toast.classList.remove('hidden');
    toastLoading.classList.remove('hidden');
    toastQuestion.classList.add('hidden');

    // After 15 seconds, show the question
    setTimeout(() => {
      toastLoading.classList.add('hidden');
      toastQuestion.classList.remove('hidden');
    }, 15000);
  });

  // Toast Yes button - just hide the toast
  toastYesBtn.addEventListener('click', () => {
    toast.classList.add('hidden');
    toastClose.classList.add('hidden');
    toastLoading.classList.remove('hidden');
    toastQuestion.classList.add('hidden');
    toastHelp.classList.add('hidden');
  });

  // Toast No button - show help in toast
  toastNoBtn.addEventListener('click', () => {
    toastQuestion.classList.add('hidden');
    toastHelp.classList.remove('hidden');
    toastClose.classList.remove('hidden');
  });

  // Close toast when clicking X button
  toastClose.addEventListener('click', () => {
    toast.classList.add('hidden');
    toastClose.classList.add('hidden');
    toastLoading.classList.remove('hidden');
    toastQuestion.classList.add('hidden');
    toastHelp.classList.add('hidden');
  });
});
