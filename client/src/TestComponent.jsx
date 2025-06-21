import React from "react";

const TestComponent = () => {
  const cardData = [
    {
      title: "Technology",
      description:
        "Explore modern innovations and digital trends shaping our future.",
      image: "https://source.unsplash.com/400x200/?technology",
      buttonText: "Learn More",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Nature",
      description: "Discover the beauty of the outdoors and how we protect it.",
      image: "https://source.unsplash.com/400x200/?nature",
      buttonText: "Explore",
      buttonColor: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Travel",
      description: "Plan your next adventure with our curated travel guides.",
      image: "https://source.unsplash.com/400x200/?travel",
      buttonText: "Get Started",
      buttonColor: "bg-yellow-500 hover:bg-yellow-600",
    },
    {
      title: "Food",
      description: "Taste the world through recipes and local cuisine stories.",
      image: "https://source.unsplash.com/400x200/?food",
      buttonText: "See Recipes",
      buttonColor: "bg-red-500 hover:bg-red-600",
    },
  ];

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Our Features</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="bg-white shadow rounded-2xl overflow-hidden"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
                <p className="text-gray-600 mb-4">{card.description}</p>
                <button
                  className={`${card.buttonColor} text-white px-4 py-2 rounded`}
                >
                  {card.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestComponent;
