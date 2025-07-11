import React from 'react';

const Certifications: React.FC = () => {
  const certificationsData = [
    { name: 'AWS Certified Solutions Architect - Associate', image: '/aws-saa.png' },
    { name: 'Certified Kubernetes Administrator (CKA)', image: '/cka.png' },
    { name: 'HashiCorp Certified: Terraform Associate', image: '/terraform.png' },
    // Add more certifications as needed
  ];

  return (
    <section id="certifications" className="py-20 px-8 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {certificationsData.map((cert, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105"
            >
              {cert.image && (
                <img src={cert.image} alt={cert.name} className="h-24 mb-4 object-contain" />
              )}
              <h3 className="text-xl font-semibold text-center">{cert.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;