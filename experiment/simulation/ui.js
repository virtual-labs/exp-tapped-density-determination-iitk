// ui.js - Language switching and UI updates

function toggleLanguagePanel() {
  const panel = document.getElementById("languagePanel");
  panel.style.display = panel.style.display === "flex" ? "none" : "flex";
}

function changeLanguage(lang) {
  currentLanguage = lang;
  const dict = languageMap[lang];

  document.getElementById("instructionText").innerText = dict.instruction;
  document.getElementById("sampleWeightLabel").innerText = dict.sample;
  document.getElementById("bulkLabel").innerText = dict.bulk;
  document.getElementById("tappedLabel").innerText = dict.tapped;
  document.getElementById("measurementTitle").innerText = dict.measure;
  document.getElementById("tapCountLabel").innerText = dict.tapCount;
  document.getElementById("startTappingBtn").innerText = dict.startBtn;
  // Don't set bgText as it contains images
  document.getElementById("stepCounter").innerText = `${dict.step} ${currentStep}`;
  document.getElementById("languageButtonText").innerText = dict.lang;

  // Update current instruction based on current step
  updateInstructionText();

  // Play audio for current step if available
  playInstructionAudio();

  toggleLanguagePanel();
}
