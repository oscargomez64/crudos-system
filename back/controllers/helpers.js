function isMissing(value) {
  return value === undefined || value === null || value === '';
}

function isValidId(value) {
  if (isMissing(value)) {
    return false;
  }

  const numberValue = Number(value);
  return Number.isInteger(numberValue) && numberValue > 0;
}

function parseOptionalNumber(value, fieldName) {
  if (isMissing(value)) {
    return undefined;
  }

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    throw new Error(`${fieldName} debe ser numerico.`);
  }

  return numberValue;
}

function parseRequiredNumber(value, fieldName) {
  if (isMissing(value)) {
    throw new Error(`${fieldName} es obligatorio.`);
  }

  return parseOptionalNumber(value, fieldName);
}

module.exports = {
  isMissing,
  isValidId,
  parseOptionalNumber,
  parseRequiredNumber
};
