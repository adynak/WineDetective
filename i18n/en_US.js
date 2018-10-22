var standards = {
	productName : 'Wine Detective'
}

var txtVarietals = {
	pageTitle: 'Varietals',
  redWine: 'Red',
  whiteWine: 'White',
  otherWine: 'Other'
};

var txtAva = {
	pageTitle: 'AVA'
};

var txtVintage = {
	pageTitle: 'Vintage'
};

var txtSecurity = {
    required: true,
    schema: 'Schema Name',
    dbPass: 'Database Password',
    pgPort: 'Database Listen Port',
    btnSubmit: 'Save',
    errSchemaRequired: 'Scnema Name is Required',
    errDbPassRequired: 'Database Password is Requried',
    errPgPortRequired: 'Database Listen Port is Requried',    
    saveSecurity: 'Database Configuration Saved.',
    saveSecurityFailed: "That Didn't Work.  Try Again or Close This WebPage."
};

var txtLogin = {
    btnLogin: 'Login',
    btnRegister: 'Register',
    btnLogout: 'Logout',
    replyTo: 'adynak@gmail.com',
    appDomain: 'noreply.com',
    credentialsValid: 'You are now logged in.',
    credentialsInvalid: 'The email or password you have entered is invalid.',
    loginError: "Maybe you just don't belong here.",
    email: 'email',
    password: 'password'
};

var txtSettings = {
    pageTitle: 'Settings',
    resetDatabaseConnection: 'Reset Database Connection',
    resetDatabaseConnectionTooltip: 'This option resets the database connection schema, database password and listen port.'
};

var txtTabNames = [
    { 
      link : 'varietal', 
      label : 'Varietal',
      type : 'all'
    },
    { 
      link : 'ava', 
      label : 'AVA',
      type : 'all'
    },
    { 
      link : 'vintage',
      label : 'Vintage',
      type : 'all'
    },
    { 
      link : 'addBottle',
      label : 'Add Wine',
      type : 'admin'
    },
    { 
      link : 'inventory',
      label : 'Inventory',
      type : 'admin'
    },
    { 
      link : 'settings',
      label : 'Settings',
      type : 'admin'
    }
]; 

var txtAddBottle = {
    pageTitle: 'Add Wine Purchase',
    vintage: 'Vintage',
    placeholderVintage : '-- choose Vintage --',
    producer: 'Producer',
    placeholderProducer: 'Who bottled this wine?',
    AKA: 'Name',
    placeholderAKA: "Is there another name for this wine?",
    vineyard: "Vineyard",
    placeholderVineyard: "Is this wine Estate, blend, vineyard block or ...?" ,
    AVA: "AVA",
    placeholderAVA: "-- choose AVA --",
    varietal: "Varietal",
    placeholderVarietal: "-- choose Varietal --",
    quantity: "Quantity",
    placeholderQuantity: "How many bottles are you adding?",
    price: "Price",
    placeholderPrice: "What did you pay for this juice?",
    reset: "Start Over",
    bins: "Continue",
    whereDoesItGo: "Where are you storing this wine?",
    modalAddNewInstructions: "Use this page to add or remove ",
    modalAddThing : 'Add',
    modalDone : 'Done',
    new: 'New',
    modalAddNewCategory: 'Category'
};

var txtInventory = {
  pageTitle: 'Inventory',
  searchEmptyText: 'Search',
  columnVarietal: 'Varietal',
  columnProducer: 'Producer',
  columnVineyard: 'Vineyard',
  columnBin: 'Bin',
  columnVintage: 'Vintage',
  columnAka: 'Brand Name'
}