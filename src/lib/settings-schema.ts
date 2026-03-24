
export const settingsSchema = {
  safeParse: (data: any) => {
    try {
      if (!data || typeof data !== 'object') {
        return { success: false, error: 'Not an object' };
      }

      const validated: any = {};

      if (data.precisionMode !== undefined) {
        if (data.precisionMode !== 'auto' && data.precisionMode !== 'fixed') {
          return { success: false, error: 'Invalid precisionMode' };
        }
        validated.precisionMode = data.precisionMode;
      }

      if (data.fixedDigits !== undefined) {
        if (typeof data.fixedDigits !== 'number' || !Number.isInteger(data.fixedDigits) || data.fixedDigits < 0 || data.fixedDigits > 10) {
          return { success: false, error: 'Invalid fixedDigits' };
        }
        validated.fixedDigits = data.fixedDigits;
      }

      if (data.primaryColor !== undefined) {
        if (typeof data.primaryColor !== 'string') {
          return { success: false, error: 'Invalid primaryColor' };
        }
        validated.primaryColor = data.primaryColor;
      }

      if (data.categoryColors !== undefined) {
        if (typeof data.categoryColors !== 'object' || data.categoryColors === null || Array.isArray(data.categoryColors)) {
          return { success: false, error: 'Invalid categoryColors' };
        }
        for (const key in data.categoryColors) {
          if (typeof data.categoryColors[key] !== 'string') {
            return { success: false, error: `Invalid color for category ${key}` };
          }
        }
        validated.categoryColors = data.categoryColors;
      }

      return { success: true, data: validated };
    } catch (e) {
      return { success: false, error: e };
    }
  }
};
