import { PostType } from "./_components/PostCard";

export const INITIAL_POSTS: PostType[] = [
    {
        id: 1,
        author: {
            name: "Sarah Williams",
            role: "Science Club President",
            image: undefined
        },
        time: "2 hours ago",
        content: "Just submitted our team's project for the National Science Fair! 🚀 Keeping our fingers crossed. Thanks to everyone who contributed to this amazing journey.",
        likes: 42,
        comments: 5,
        media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800&auto=format&fit=crop&q=60', name: 'project.jpg' }
        ]
    },
    {
        id: 2,
        author: {
            name: "David Chen",
            role: "Student Council Member",
            image: undefined
        },
        time: "5 hours ago",
        content: "The annual Sports Week schedule is out! Check out the notice board for more details. Who else is excited for the inter-house cricket tournament? 🏏",
        likes: 128,
        comments: 24,
    }
];
