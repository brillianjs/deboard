import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧", shortName: "EN" },
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩", shortName: "ID" },
  { code: "zh", name: "中文", flag: "🇨🇳", shortName: "ZH" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const cycleLanguage = () => {
    const currentIndex = languages.findIndex(
      (lang) => lang.code === i18n.language
    );
    const nextIndex = (currentIndex + 1) % languages.length;
    const nextLanguage = languages[nextIndex];

    i18n.changeLanguage(nextLanguage.code);
    localStorage.setItem("language", nextLanguage.code);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={cycleLanguage}
      title={`Current: ${currentLanguage.name}. Click to switch`}
      className="relative"
    >
      <span className="text-lg">{currentLanguage.flag}</span>
      <span className="sr-only">Switch language: {currentLanguage.name}</span>
    </Button>
  );
}
