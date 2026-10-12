import { __ } from "@/translation";

export const getRepetitionText = (repetition: any) => {
  const parts: string[] = [];

  if (repetition.all) {
    parts.push(__("week"));
  } else {
    if (repetition.first) parts.push(__("first"));
    if (repetition.second) parts.push(__("second"));
    if (repetition.third) parts.push(__("third"));
    if (repetition.fourth) parts.push(__("fourth"));
    if (repetition.fifth) parts.push(__("fifth"));

    if (parts.length === 0) return "";

    if (parts.length > 1) {
      const last = parts.pop();
      parts[parts.length - 1] = `${parts[parts.length - 1]} ${__("and")} ${last}`;
    }

    parts[0] = parts[0]!.charAt(0) + parts[0]!.slice(1);
    return __("Every {0} week", [parts.join(", ")]);
  }

  return parts[0] ? __("Every {0}", [parts[0]]) : "";
};
