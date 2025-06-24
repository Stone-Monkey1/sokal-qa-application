// tools.js

export const tools = [
  {
    id: 'ipacket-vehicle-records',
    name: 'iPacket Vehicle Records',
    websites: [
      'https://www.capitalchevroletofshallotte.com/',
      'https://www.kellygmcbuick.com/vehicles/',
    ],
    locationTags: {
      siteLocations: ['SRP', 'VDP'],
      webDashLocations: ['Vehicle Badges', 'Website Scripts'],
    },
    ticketReferences: [],
    description:
      'A green rectangular vehicle badge with the text Vehicle Records on the top line and the text Powered by iPacket on the bottom line to the right of an icon of a file folder in a circle. The Website Script for this tool also creates a section on the VDP headed with "iPacket" and "Vehicle Records" below that. This section houses multiple rectangular image cards with text overlay (such as "What is iPacket?" or "Vehicle OEM Info") that upon clicking may bring up an informational modal.',
  },
  {
    id: 'vauto-360-spin',
    name: 'vAuto 360 Spin',
    websites: ['https://www.discoveryauto.com/'],
    locationTags: null,
    ticketReferences: [],
    description:
      'A badge typically located on either or both the SRP/VDP. The badge looks like a video and upon clicking shows a 360 view of the vehicle it is on.',
  },
  {
    id: 'lesa-fmv',
    name: 'LESA FMV',
    websites: ['https://www.kellygmcbuick.com/'],
    locationTags: {
      siteLocations: ['SRP', 'VDP'],
      webDashLocations: ['Vehicle Badges', 'Website Scripts'],
    },
    ticketReferences: ['https://support.gosokal.com/staff/ticket/79205'],
    description:
      'A badge typically located on either or both the SRP/VDP. The badge looks like a video and upon clicking shows a 360 view of the vehicle it is on.',
  },
  {
    id: 'trade-pending-snap',
    name: 'Trade Pending Snap',
    websites: ['https://www.kellygmcbuick.com/'],
    locationTags: {
      siteLocations: ['Value Your Trade', 'Homepage', 'SRP/VDP'],
      webDashLocations: ['Manage Pages', 'Search Results Buttons', 'Website Scripts'],
    },
    ticketReferences: [],
    description:
      'Trade Pending Snap involves multiple tools, some of which appear after the initial scripts have been installed and the TP team enables them. The tools are: a set of buttons at the bottom of the page including "Explore Payments" and "Value Your Trade", a dedicated page usually given the slug "value-your-trade", and a set of buttons in Search Results Buttons typically named "Calculate Payment", "Schedule Test Drive", "Value Your Trade". The SR buttons may have icons on the left side and two lines of stacked text to the right of those icons. These buttons will bring up a modal for the corresponding Trade Pending tool.',
  },
  {
    id: 'edmunds-carcode',
    name: 'Edmunds Carcode',
    websites: ['https://www.kellygmcbuick.com/'],
    locationTags: {
      siteLocations: ['All Pages - Head Tag'],
      webDashLocations: ['Website Scripts'],
    },
    ticketReferences: [],
    description:
      'A badge typically located on either or both the SRP/VDP. The badge looks like a video and upon clicking shows a 360 view of the vehicle it is on.',
  },
];
