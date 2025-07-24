'use client';

import Image from 'next/image';
import SectionWrapper from './SectionWrapper';

const AboutMe = () => {
  return (
    <SectionWrapper id="about" title="About Me">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/3 flex justify-center">
          <Image
            src="https://github.com/sanket363.png"
            alt="Sanket Bhalke"
            width={250}
            height={250}
            className="rounded-full border-4 border-ctp-sapphire shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="md:w-2/3 text-lg text-ctp-text space-y-4 text-center md:text-left">
          <p>
            Hello! I'm Sanket, a DevOps Engineer with a strong passion for building robust, scalable, and efficient infrastructure. My expertise lies in automating development pipelines, managing cloud services, and ensuring system reliability.
          </p>
          <p>
            I thrive on solving complex problems and continuously learning about new technologies in the cloud-native landscape. My goal is to bridge the gap between development and operations to create a seamless and productive workflow.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default AboutMe;
