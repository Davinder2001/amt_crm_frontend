'use client';

import React, { useEffect, useState } from 'react';
import PackagesView from './components/packagesView';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import BusinessCategories from './components/Categories';
import PackageDetails from './components/PackageDetails';
import { Box, Tab, Tabs } from '@mui/material';

const Page = () => {
  const { setTitle } = useBreadcrumb();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    setTitle('All packages Plan');
  }, [setTitle]);

  return (
    <div className="add-packages-conatiner">
      <Box sx={{
        borderBottom: 1,
        borderColor: 'divider',
        mb: 2,
        '& .MuiTabs-scroller': {
          overflow: 'visible !important'
        }
      }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="package tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              color: 'var(--primary-color)',
              '&.Mui-disabled': {
                color: '#ccc',
              },
              '&.Mui-selected': {
                color: 'var(--primary-color)',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'var(--primary-color)',
            },
          }}
        >
          <Tab label="Packages" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Categories" id="tab-1" aria-controls="tabpanel-1" />
          <Tab label="Package Details" id="tab-2" aria-controls="tabpanel-2" />
        </Tabs>
      </Box>

      <div role="tabpane0" hidden={value !== 0} id="tabpanel-0" aria-labelledby="tab-0">
        {value === 0 && (
          <div className=" form-section-one">
            <PackagesView />
          </div>
        )}
      </div>
      <div className="form">
        <div role="tabpanel" hidden={value !== 1} id="tabpanel-1" aria-labelledby="tab-1">
          {value === 1 && (
            <div className="form-section-two">
              <BusinessCategories />
            </div>
          )}
        </div>
      </div>

      <div role="tabpanel" hidden={value !== 2} id="tabpanel-2" aria-labelledby="tab-2">
        {value === 2 && (
          <div className="form-section-three">
            <PackageDetails />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;