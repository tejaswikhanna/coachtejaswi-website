(function($) {
  window.fnames = new Array();
  window.ftypes = new Array();
  fnames[0] = 'EMAIL';
  ftypes[0] = 'email';
  fnames[1] = 'FNAME';
  ftypes[1] = 'text';
  fnames[2] = 'LNAME';
  ftypes[2] = 'text';
  fnames[3] = 'ADDRESS';
  ftypes[3] = 'address';
  fnames[4] = 'PHONE';
  ftypes[4] = 'phone';
  fnames[5] = 'BIRTHDAY';
  ftypes[5] = 'birthday';
}(jQuery));
var $mcj = jQuery.noConflict(true);

// SMS Phone Multi-Country Functionality
if (!window.MC) {
  window.MC = {};
}
window.MC.smsPhoneData = {
  defaultCountryCode: 'IN',
  programs: [],
  smsProgramDataCountryNames: []
};

function getCountryUnicodeFlag(countryCode) {
  return countryCode.toUpperCase().replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
};

function sanitizeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

function sanitizeUrl(url) {
  if (typeof url !== 'string') return '';
  const trimmedUrl = url.trim().toLowerCase();
  if (trimmedUrl.startsWith('javascript:') || trimmedUrl.startsWith('data:') || trimmedUrl.startsWith('vbscript:')) {
    return '#';
  }
  return url;
}

const getBrowserLanguage = () => {
  if (!window?.navigator?.language?.split('-')[1]) {
    return window?.navigator?.language?.toUpperCase();
  }
  return window?.navigator?.language?.split('-')[1];
};

function getDefaultCountryProgram(defaultCountryCode, smsProgramData) {
  if (!smsProgramData || smsProgramData.length === 0) {
    return null;
  }
  const browserLanguage = getBrowserLanguage();
  if (browserLanguage) {
    const foundProgram = smsProgramData.find(
      (program) => program?.countryCode === browserLanguage,
    );
    if (foundProgram) {
      return foundProgram;
    }
  }
  if (defaultCountryCode) {
    const foundProgram = smsProgramData.find(
      (program) => program?.countryCode === defaultCountryCode,
    );
    if (foundProgram) {
      return foundProgram;
    }
  }
  return smsProgramData[0];
}

function updateSmsLegalText(countryCode, fieldName) {
  if (!countryCode || !fieldName) return;
  const programs = window?.MC?.smsPhoneData?.programs;
  if (!programs || !Array.isArray(programs)) return;
  const program = programs.find(program => program?.countryCode === countryCode);
  if (!program || !program.requiredTemplate) return;
  const legalTextElement = document.querySelector('#legal-text-' + fieldName);
  if (!legalTextElement) return;
  const divRegex = new RegExp('</?[div][^>]*>', 'gi');
  const template = program.requiredTemplate.replace(divRegex, '');
  legalTextElement.textContent = '';
  const parts = template.split(/(<a href=".*?" target=".*?">.*?<\/a>)/g);
  parts.forEach(function(part) {
    if (!part) return;
    const anchorMatch = part.match(/<a href="(.*?)" target="(.*?)">(.*?)<\/a>/);
    if (anchorMatch) {
      const linkElement = document.createElement('a');
      linkElement.href = sanitizeUrl(anchorMatch[1]);
      linkElement.target = sanitizeHtml(anchorMatch[2]);
      linkElement.textContent = sanitizeHtml(anchorMatch[3]);
      legalTextElement.appendChild(linkElement);
    } else {
      legalTextElement.appendChild(document.createTextNode(part));
    }
  });
}

function generateDropdownOptions(smsProgramData) {
  if (!smsProgramData || smsProgramData.length === 0) return '';
  var programs = smsProgramData;
  return programs.map(program => {
    const flag = getCountryUnicodeFlag(program.countryCode);
    const countryName = getCountryName(program.countryCode);
    const callingCode = program.countryCallingCode || '';
    const sanitizedCountryCode = sanitizeHtml(program.countryCode || '');
    const sanitizedCountryName = sanitizeHtml(countryName || '');
    const sanitizedCallingCode = sanitizeHtml(callingCode || '');
    return '<option value="' + sanitizedCountryCode + '">' + sanitizedCountryName + ' ' + sanitizedCallingCode + '</option>';
  }).join('');
}

function getCountryName(countryCode) {
  if (window.MC?.smsPhoneData?.smsProgramDataCountryNames && Array.isArray(window.MC.smsPhoneData.smsProgramDataCountryNames)) {
    for (let i = 0; i < window.MC.smsPhoneData.smsProgramDataCountryNames.length; i++) {
      if (window.MC.smsPhoneData.smsProgramDataCountryNames[i].code === countryCode) {
        return window.MC.smsPhoneData.smsProgramDataCountryNames[i].name;
      }
    }
  }
  return countryCode;
}

function getDefaultPlaceholder(countryCode) {
  if (!countryCode || typeof countryCode !== 'string') return '+1 000 000 0000';
  var mockPlaceholders = [
    { countryCode: 'US', placeholder: '+1 000 000 0000' },
    { countryCode: 'GB', placeholder: '+44 0000 000000' },
    { countryCode: 'CA', placeholder: '+1 000 000 0000' },
    { countryCode: 'AU', placeholder: '+61 000 000 000' },
    { countryCode: 'DE', placeholder: '+49 000 0000000' },
    { countryCode: 'FR', placeholder: '+33 0 00 00 00 00' },
    { countryCode: 'ES', placeholder: '+34 000 000 000' },
    { countryCode: 'NL', placeholder: '+31 0 00000000' },
    { countryCode: 'BE', placeholder: '+32 000 00 00 00' },
    { countryCode: 'CH', placeholder: '+41 00 000 00 00' },
    { countryCode: 'AT', placeholder: '+43 000 000 0000' },
    { countryCode: 'IE', placeholder: '+353 00 000 0000' },
    { countryCode: 'IT', placeholder: '+39 000 000 0000' },
    { countryCode: 'NO', placeholder: '+47 000 00 000' },
    { countryCode: 'SE', placeholder: '+46 00 000 00 00' },
    { countryCode: 'DK', placeholder: '+45 00 00 00 00' },
    { countryCode: 'FI', placeholder: '+358 00 000 0000' },
    { countryCode: 'EE', placeholder: '+372 0000 0000' },
    { countryCode: 'PL', placeholder: '+48 000 000 000' },
    { countryCode: 'SK', placeholder: '+421 000 000 000' },
    { countryCode: 'LV', placeholder: '+371 0000 0000' },
    { countryCode: 'LT', placeholder: '+370 0000 0000' },
    { countryCode: 'GR', placeholder: '+30 000 000 0000' },
    { countryCode: 'PT', placeholder: '+351 000 000 000' },
    { countryCode: 'HR', placeholder: '+385 00 000 0000' },
    { countryCode: 'SI', placeholder: '+386 00 000 000' },
    { countryCode: 'IS', placeholder: '+354 000 0000' },
    { countryCode: 'LU', placeholder: '+352 000 000 000' },
    { countryCode: 'MC', placeholder: '+377 00 00 00 00' },
    { countryCode: 'AD', placeholder: '+376 000 000' },
    { countryCode: 'JE', placeholder: '+44 0000 000000' },
    { countryCode: 'IM', placeholder: '+44 0000 000000' },
    { countryCode: 'GG', placeholder: '+44 0000 000000' },
    { countryCode: 'AL', placeholder: '+355 00 000 0000' },
    { countryCode: 'SM', placeholder: '+378 0000 000000' },
    { countryCode: 'FO', placeholder: '+298 000000' },
    { countryCode: 'MT', placeholder: '+356 0000 0000' },
    { countryCode: 'LI', placeholder: '+423 000 0000' },
    { countryCode: 'GI', placeholder: '+350 000 00000' },
    { countryCode: 'MD', placeholder: '+373 00 000 000' },
    { countryCode: 'HU', placeholder: '+36 00 000 0000' },
    { countryCode: 'NZ', placeholder: '+64 00 000 0000' },
    { countryCode: 'ME', placeholder: '+382 00 000 000' }
  ];
  const selectedPlaceholder = mockPlaceholders.find(item => item.countryCode === countryCode);
  return selectedPlaceholder ? selectedPlaceholder.placeholder : mockPlaceholders[0].placeholder;
}

function updatePlaceholder(countryCode, fieldName) {
  if (!countryCode || !fieldName) return;
  const phoneInput = document.querySelector('#mce-' + fieldName);
  if (!phoneInput) return;
  const placeholder = getDefaultPlaceholder(countryCode);
  if (placeholder) phoneInput.placeholder = placeholder;
}

function updateCountryCodeInstruction(countryCode, fieldName) {
  updatePlaceholder(countryCode, fieldName);
}

function initializeSmsPhoneDropdown(fieldName) {
  if (!fieldName || typeof fieldName !== 'string') return;
  const dropdown = document.querySelector('#country-select-' + fieldName);
  const displayFlag = document.querySelector('#flag-display-' + fieldName);
  if (!dropdown || !displayFlag) return;
  const smsPhoneData = window.MC?.smsPhoneData;
  if (smsPhoneData && smsPhoneData.programs && Array.isArray(smsPhoneData.programs)) {
    dropdown.innerHTML = generateDropdownOptions(smsPhoneData.programs);
  }
  const defaultProgram = getDefaultCountryProgram(smsPhoneData?.defaultCountryCode, smsPhoneData?.programs);
  if (defaultProgram && defaultProgram.countryCode) {
    dropdown.value = defaultProgram.countryCode;
    const flagSpan = displayFlag?.querySelector('#flag-emoji-' + fieldName);
    if (flagSpan) {
      flagSpan.textContent = getCountryUnicodeFlag(defaultProgram.countryCode);
      flagSpan.setAttribute('aria-label', sanitizeHtml(defaultProgram.countryCode) + ' flag');
    }
    updateSmsLegalText(defaultProgram.countryCode, fieldName);
    updatePlaceholder(defaultProgram.countryCode, fieldName);
    updateCountryCodeInstruction(defaultProgram.countryCode, fieldName);
  }

  displayFlag?.addEventListener('click', function(e) {
    dropdown.focus();
  });

  dropdown?.addEventListener('change', function() {
    const selectedCountry = this.value;
    if (!selectedCountry) return;
    const flagSpan = displayFlag?.querySelector('#flag-emoji-' + fieldName);
    if (flagSpan) {
      flagSpan.textContent = getCountryUnicodeFlag(selectedCountry);
      flagSpan.setAttribute('aria-label', sanitizeHtml(selectedCountry) + ' flag');
    }
    updateSmsLegalText(selectedCountry, fieldName);
    updatePlaceholder(selectedCountry, fieldName);
    updateCountryCodeInstruction(selectedCountry, fieldName);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const smsPhoneFields = document.querySelectorAll('[id^="country-select-"]');
  smsPhoneFields.forEach(function(dropdown) {
    const fieldName = dropdown?.id.replace('country-select-', '');
    initializeSmsPhoneDropdown(fieldName);
  });
});
