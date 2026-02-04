"use client";
import React from "react";
import { HeroParallax } from "./ui/hero-parallax";

export function HeroParallaxDemo() {
    return <HeroParallax products={products} />;
}
export const products = [
    {
        title: "Neural Mastery Core",
        link: "/courses",
        thumbnail: "/images/premium/brain.png",
    },
    {
        title: "Intelligent Systems",
        link: "/courses",
        thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc46386c635?w=600",
    },
    {
        title: "Neural Engineering",
        link: "/courses",
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600",
    },
    {
        title: "AI Agent Development",
        link: "/courses",
        thumbnail: "https://images.unsplash.com/photo-1675271591211-126ad94e495d?w=600",
    },
    {
        title: "Generative Art",
        link: "/courses",
        thumbnail: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600",
    },
    {
        title: "Data Intelligence",
        link: "/courses",
        thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600",
    },
    {
        title: "Robotics Core",
        link: "/courses",
        thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600",
    },
    {
        title: "Network Synergy",
        link: "/courses",
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600",
    },
    {
        title: "Tech Infrastructure",
        link: "/courses",
        thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
    },
    {
        title: "Cyber Security AI",
        link: "/courses",
        thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600",
    },
    {
        title: "Quantum Computing",
        link: "/courses",
        thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600",
    },
    {
        title: "Deep Learning Flux",
        link: "/courses",
        thumbnail: "https://images.unsplash.com/photo-1673862311394-82a84976c6ae?w=600",
    },
    {
        title: "Cloud Interface",
        link: "/courses",
        thumbnail: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600",
    },
    {
        title: "Humanoid Research",
        link: "/courses",
        thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600",
    },
    {
        title: "Prompt Engineering",
        link: "/courses",
        thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600",
    },
];
