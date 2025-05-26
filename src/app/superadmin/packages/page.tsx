'use client';

import React, { useEffect, useState } from 'react';
import PackagesView from './components/packagesView';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import BusinessCategories from './components/Categories';
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
        mb: 3,
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
              textTransform: 'none',
              fontSize: '1rem',
              color: '#718096',
              minHeight: '48px',
              padding: '12px 24px',
              '&:hover': {
                backgroundColor: '#f8fafc'
              },
              '&.Mui-selected': {
                color: 'var(--primary-color)',
                fontWeight: 500,
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'var(--primary-color)',
              height: '2px'
            },
          }}
        >
          <Tab label="Packages" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Categories" id="tab-1" aria-controls="tabpanel-1" />
        </Tabs>
      </Box>

      <div className="form">
        <div role="tabpanel" hidden={value !== 0} id="tabpanel-0" aria-labelledby="tab-0">
          {value === 0 && (
            <div className=" form-section-one">
              <PackagesView />
            </div>
          )}
        </div>

        <div role="tabpanel" hidden={value !== 1} id="tabpanel-1" aria-labelledby="tab-1">
          {value === 1 && (
            <div className="form-section-two">
              <BusinessCategories />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;