// Continents and their countries
export const CONTINENTS = {
  Africa: {
    name: 'Africa',
    nameFr: 'Afrique',
    emoji: '🌍',
    countries: [
      'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi',
      'Cameroon', 'Cape Verde', 'Central African Republic', 'Chad', 'Comoros',
      'Congo', 'Democratic Republic of the Congo', 'Djibouti', 'Egypt',
      'Equatorial Guinea', 'Eritrea', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana',
      'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia',
      'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius',
      'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda',
      'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone',
      'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Swaziland', 'Tanzania',
      'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'
    ]
  },
  Asia: {
    name: 'Asia',
    nameFr: 'Asie',
    emoji: '🌏',
    countries: [
      'Afghanistan', 'Armenia', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Bhutan',
      'Brunei', 'Cambodia', 'China', 'Georgia', 'Hong Kong', 'India', 'Indonesia',
      'Iran', 'Iraq', 'Israel', 'Japan', 'Jordan', 'Kazakhstan', 'Kuwait',
      'Kyrgyzstan', 'Laos', 'Lebanon', 'Macau', 'Malaysia', 'Maldives', 'Mongolia',
      'Myanmar', 'Nepal', 'North Korea', 'Oman', 'Pakistan', 'Palestine',
      'Philippines', 'Qatar', 'Saudi Arabia', 'Singapore', 'South Korea',
      'Sri Lanka', 'Syria', 'Taiwan', 'Tajikistan', 'Thailand', 'Timor-Leste',
      'Turkey', 'Turkmenistan', 'United Arab Emirates', 'Uzbekistan', 'Vietnam', 'Yemen'
    ]
  },
  Europe: {
    name: 'Europe',
    nameFr: 'Europe',
    emoji: '🇪🇺',
    countries: [
      'Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus',
      'Belgium', 'Bosnia and Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus',
      'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Georgia',
      'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Kosovo',
      'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia',
      'Malta', 'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'Norway',
      'Poland', 'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia',
      'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine',
      'United Kingdom', 'Vatican City'
    ]
  },
  'North America': {
    name: 'North America',
    nameFr: 'Amérique du Nord',
    emoji: '🌎',
    countries: [
      'Antigua and Barbuda', 'Bahamas', 'Barbados', 'Belize', 'Canada',
      'Costa Rica', 'Cuba', 'Dominica', 'Dominican Republic', 'El Salvador',
      'Grenada', 'Guatemala', 'Haiti', 'Honduras', 'Jamaica', 'Mexico',
      'Nicaragua', 'Panama', 'Saint Kitts and Nevis', 'Saint Lucia',
      'Saint Vincent and the Grenadines', 'Trinidad and Tobago', 'United States'
    ]
  },
  'South America': {
    name: 'South America',
    nameFr: 'Amérique du Sud',
    emoji: '🌎',
    countries: [
      'Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Ecuador',
      'Guyana', 'Paraguay', 'Peru', 'Suriname', 'Uruguay', 'Venezuela'
    ]
  },
  Oceania: {
    name: 'Oceania',
    nameFr: 'Océanie',
    emoji: '🌏',
    countries: [
      'Australia', 'Fiji', 'Kiribati', 'Marshall Islands', 'Micronesia',
      'Nauru', 'New Zealand', 'Palau', 'Papua New Guinea', 'Samoa',
      'Solomon Islands', 'Tonga', 'Tuvalu', 'Vanuatu'
    ]
  }
};

export const getContinentsList = () => {
  return Object.values(CONTINENTS);
};

export const getCountriesByContinent = (continentName) => {
  return CONTINENTS[continentName]?.countries || [];
};
