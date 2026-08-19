export function generateFromTemplate(template, data) {
  const replace = (text = "") =>
    text.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()] || "");

  return {
    meta_title: replace(template.title_template),
    meta_description: replace(template.description_template),
    og_title: replace(template.title_template),
    og_description: replace(template.description_template),
    robots_index: true,
    robots_follow: true,
  };
}