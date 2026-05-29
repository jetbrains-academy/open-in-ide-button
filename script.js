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
function generateToolboxCourseOpeningLink(courseId, supportedIdes) {
  const url = new URL('jetbrains://educational');
  url.searchParams.append('courseId', courseId.toString());
  url.searchParams.append('source', 'marketplace');
  url.searchParams.append('tools', supportedIdes.join(','));
  url.searchParams.append('minToolVersion', '251');
  url.searchParams.append('minPluginVersion', '2025.7');
  return url.toString();
}

// Initialize the form
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('courseForm');
  const modal = document.getElementById('modal');
  const questionView = document.getElementById('questionView');
  const helpView = document.getElementById('helpView');
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const modalOverlay = document.querySelector('.modal-overlay');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const marketplaceId = document.getElementById('marketplaceId').value;
    const programmingLanguage = document.getElementById('programmingLanguage').value;

    if (!marketplaceId || !programmingLanguage) {
      alert('Please fill in all fields');
      return;
    }

    // Generate the link
    const courseNumericId = Number(marketplaceId);
    const supportedIdes = resolveSupportedIdes(programmingLanguage);

    if (supportedIdes.length === 0) {
      alert('No supported IDEs found for this language');
      return;
    }

    const link = generateToolboxCourseOpeningLink(courseNumericId, supportedIdes);

    // Open the link immediately
    window.location.href = link;

    // Show modal after a delay
    setTimeout(() => {
      modal.classList.remove('hidden');
    }, 1000);
  });

  // Yes button - close modal
  yesBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    questionView.classList.remove('hidden');
    helpView.classList.add('hidden');
  });

  // No button - show help message
  noBtn.addEventListener('click', () => {
    questionView.classList.add('hidden');
    helpView.classList.remove('hidden');
  });

  // Close modal when clicking overlay
  modalOverlay.addEventListener('click', () => {
    modal.classList.add('hidden');
    questionView.classList.remove('hidden');
    helpView.classList.add('hidden');
  });
});
