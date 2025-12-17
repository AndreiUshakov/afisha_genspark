import Header from './Header';
import HeaderWrapper from './HeaderWrapper';

export default async function ConditionalHeader() {
  return (
    <HeaderWrapper>
      <Header />
    </HeaderWrapper>
  );
}