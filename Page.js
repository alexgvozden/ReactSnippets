import React, { lazy, memo } from 'react';
import { connect } from 'react-redux';

/**
 * Render page based on data and imported module and Redux mapping
 * @param       {Object} dynamicImportedModule imported page module
 * @param       {Object} data                  data for the page sent from the template and global state
 * @param       {Object} mapState              mapState function for Redux
 * @param       {Object} mapDispatch           mapDispatch function for Redux
 * @param       {Object} mergeProps            mergeProps function for Redux
 * @constructor
 */
export const Page = (
  dynamicImportedModule,
  data,
  mapState,
  mapDispatch,
  mergeProps,
) => {
  // return lazy for async page loading
  return lazy(() => {
    // you have to return promise when resolving dynamic import
    return new Promise(resolve => {
      return resolve(dynamicImportedModule());
    }).then(({ default: LazyComponent }) => {
      // take default as LazyComponent and if mapState or mapDispatch provided, run Redux connect 
      const LazyWrappedComponent =
        mapState || mapDispatch
          ? connect(
              mapState,
              mapDispatch,
              mergeProps,
            )(LazyComponent)
          : LazyComponent; // in case no Redux needed just use normal component
          
      // return lazy loaded component with data you supplied
      return { default: () => <LazyWrappedComponent {...data} /> };
    });
  });
};

// memoize your component
export default (...data) => memo(Page(...data));
