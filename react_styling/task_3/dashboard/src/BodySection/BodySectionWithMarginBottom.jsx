import BodySection from './BodySection';

export default function BodySectionWithMarginBottom({ title, children }) {
  return (
    <div className="bodySectionWithMargin mb-10">
      <BodySection title={title}>
        {children}
      </BodySection>
    </div>
  );
}