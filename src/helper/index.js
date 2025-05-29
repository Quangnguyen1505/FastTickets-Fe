const convertToAPIDateFormat = (dateString) => {
  if (!dateString) return '';

  const parts = dateString.split('/');
  if (parts.length !== 3) return '';

  const [day, month, year] = parts;

  if (!day || !month || !year) return '';

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

export default convertToAPIDateFormat;
