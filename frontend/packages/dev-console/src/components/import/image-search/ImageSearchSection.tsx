import * as React from 'react';

import ImageSearch from './ImageSearch';
import FormSection from '../section/FormSection';
import SearchStatus from './SearchStatus';
import SearchResults from './SearchResults';

const ImageSearchSection: React.FC = () => {
  return (
    <FormSection
      title="Image Search"
      subTitle="Deploy an existing image from an image registry."
      divider
    >
      <ImageSearch />
      <SearchStatus />
      <SearchResults />
    </FormSection>
  );
};

export default ImageSearchSection;
