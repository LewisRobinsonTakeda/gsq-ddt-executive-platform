/**
 * True when running as a published/playing app.
 * False when running in authoring mode (DevCenter iframe).
 */
export const isPlayingApp: boolean = !!import.meta.env.PROD;
