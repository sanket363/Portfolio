import React from 'react';

const certificationsData = [
  {
    name: 'AWS Certified Solutions Architect - Associate',
    image: 'https://via.placeholder.com/150/FF9900/FFFFFF?text=AWS+SAA',
    link: '#',
  },
  {
    name: 'Certified Kubernetes Administrator (CKA)',
    image: 'https://via.placeholder.com/150/326CE5/FFFFFF?text=CKA',
    link: '#',
  },
  {
    name: 'Microsoft Certified: Azure Administrator Associate',
    image: 'https://via.placeholder.com/150/0078D4/FFFFFF?text=Azure+Admin',
    link: '#',
  },
];

const Certifications: React.FC = () => {
  return (
    <section id="certifications" className="py-16 px-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificationsData.map((cert, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
            >
              <img src={cert.image} alt={cert.name} className="w-32 h-32 object-contain mb-4" />
              <h3 className="text-xl font-semibold text-center mb-2">{cert.name}</h3>
              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Credential
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;