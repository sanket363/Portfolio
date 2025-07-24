'use client';

import SectionWrapper from './SectionWrapper';
import Button from './Button';
import { FaDownload } from 'react-icons/fa';

const Resume = () => {
  return (
    <SectionWrapper id="resume" title="Resume">
      <div className="text-center">
        <p className="text-xl text-ctp-text mb-8">Interested in my full profile? Download my resume.</p>
        <a href="/resume.pdf" download="SanketBhalke_Resume.pdf">
          <Button>
            <span className="flex items-center gap-2">
              <FaDownload />
              Download Resume
            </span>
          </Button>
        </a>
      </div>
    </SectionWrapper>
  );
};

export default Resume;
