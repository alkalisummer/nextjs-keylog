export const getEditorToolbar = () => {
  return [
    ['bold', 'italic', 'strike', 'hr'],
    ['image', 'table'],
    ['ul', 'ol', 'task'],
    ['code', 'codeblock'],
  ];
};

export const sanitizeHashtag = (value: string) => value.trim().replace(/^#/, '');
