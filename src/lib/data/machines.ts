export const mockMachines = [
  {
    id: 'MAC-DRY-01',
    daiId: 'DAI-NGW-01',
    name: 'Bed Dryer 1',
    type: 'dryer',
    capacity: 5000, // kg
    status: 'active',
    lastMaintenance: '2026-06-15',
    nextMaintenance: '2026-09-15',
  },
  {
    id: 'MAC-DRY-02',
    daiId: 'DAI-NGW-01',
    name: 'Bed Dryer 2',
    type: 'dryer',
    capacity: 5000, // kg
    status: 'idle',
    lastMaintenance: '2026-05-10',
    nextMaintenance: '2026-08-10',
  },
  {
    id: 'MAC-MIL-01',
    daiId: 'DAI-NGW-01',
    name: 'Rice Milling Unit (RMU) Utama',
    type: 'milling',
    capacity: 2000, // kg/hour
    status: 'active',
    lastMaintenance: '2026-07-01',
    nextMaintenance: '2026-10-01',
  },
  {
    id: 'MAC-SOR-01',
    daiId: 'DAI-NGW-01',
    name: 'Color Sorter',
    type: 'sorter',
    capacity: 1000, // kg/hour
    status: 'active',
    lastMaintenance: '2026-06-20',
    nextMaintenance: '2026-09-20',
  },
  {
    id: 'MAC-PKG-01',
    daiId: 'DAI-NGW-01',
    name: 'Auto Packaging 5kg/10kg',
    type: 'packaging',
    capacity: 500, // bags/hour
    status: 'maintenance',
    lastMaintenance: '2026-07-20',
    nextMaintenance: '2026-07-22',
  }
];
