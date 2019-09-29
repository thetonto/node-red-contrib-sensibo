this.names = {
    'livingroom': 'KN6PnUwG',
  };
  
  // API settings
  this.api_root = 'https://home.sensibo.com/api/v2';
  this.api_key = 'k3UFQF3fUCMaCv8VDmcoYzGBT1tglj';
  this.pod = 'KN6PnUwG';

  // Valid values for particular AC state settings
  this.valid_values = {
    fanLevel: new Set(['quiet', 'low', 'medium low', 'medium', 'medium high', 'high', 'auto']),
    mode: new Set(['cool', 'heat', 'fan', 'dry', 'auto']),
  };