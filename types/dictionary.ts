export type Locale = "en" | "ar";

export type Dictionary = {
  login: {
    title: string;
    description: string;
    email: string;
    password: string;
    button: string;
    loggingIn: string;
    success: string;
    welcome: string;
    failed: string;
    error: string;
    noAccount: string;
    register: string;
  };
  register: {
    title: string;
    description: string;
    name: string;
    email: string;
    password: string;
    confirm: string;
    button: string;
    creating: string;
    success: string;
    error: string;
    failed: string;
    passwordMismatch: string;
    haveAccount: string;
    login: string;
  };
  home: {
    title: string;
    subtitle: string;
    login: string;
    register: string;
    feature1: {
      title: string;
      desc: string;
    };
    feature2: {
      title: string;
      desc: string;
    };
    feature3: {
      title: string;
      desc: string;
    };
  };
  dashboard: {
    title: string;
    add: string;
    noRecipesTitle: string;
    noRecipesDesc: string;
    successAdd: string;
    successEdit: string;
    successDelete: string;
    errorLoad: string;
    errorAdd: string;
    errorEdit: string;
    errorDelete: string;
    dialogAddTitle: string;
    dialogAddDesc: string;
    dialogEditTitle: string;
    dialogEditDesc: string;
    confirmDeleteTitle: string;
    confirmDeleteDesc: string;
    cancel: string;
    delete: string;
  };
  grocery: {
    title: string;
    copy: string;
    export: string;
    refresh: string;
    empty: string;
    errorLoad: string;
    successCopy: string;
    errorCopy: string;
    comingSoon: string;
    clipboard: string;
    listTitle: string;
  };
  mealPlanner: {
    title: string;
    add: string;
    dialogAddTitle: string;
    dialogAddDesc: string;
    day: string;
    mealType: string;
    recipe: string;
    selectDay: string;
    selectMealType: string;
    selectRecipe: string;
    addToPlan: string;
    success: string;
    successRemove: string;
    error: string;
    errorDelete: string;
    errorTitle: string;
    errorDesc: string;
    emptyError: string;
    confirmDeleteTitle: string;
    confirmDeleteDesc: string;
    cancel: string;
    remove: string;
  };
};
