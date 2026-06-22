/**
 * Phase 2 seed: 3 categories + 3 tools (ChatGPT, Claude, Midjourney).
 *
 * Idempotent — documents use deterministic _ids and createOrReplace, so
 * re-running updates rather than duplicating. Logos are fetched from each
 * tool's favicon/official source and uploaded as Sanity image assets.
 *
 * Run: node --env-file=.env.local scripts/seed.mjs
 */
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

if (!projectId || !dataset || !token) {
  console.error(
    "Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

/** Build a portable-text block array from an array of paragraph strings. */
function blocks(paragraphs) {
  return paragraphs.map((text, i) => ({
    _type: "block",
    _key: `b${i}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `s${i}`, text, marks: [] }],
  }));
}

const categories = [
  {
    _id: "category-ai-chatbots",
    _type: "category",
    title: "AI Chatbots",
    slug: { _type: "slug", current: "ai-chatbots" },
    description:
      "General-purpose AI assistants for chat, writing, and reasoning.",
    icon: "MessageSquare",
  },
  {
    _id: "category-ai-image-generation",
    _type: "category",
    title: "AI Image Generation",
    slug: { _type: "slug", current: "ai-image-generation" },
    description:
      "Tools that generate images, art, and visuals from text prompts.",
    icon: "Image",
  },
  {
    _id: "category-ai-coding",
    _type: "category",
    title: "AI Coding Assistants",
    slug: { _type: "slug", current: "ai-coding" },
    description:
      "AI tools that help developers write, debug, and review code.",
    icon: "Code",
  },
];

/** Upload a logo from a URL and return an image field referencing the asset. */
async function uploadLogo(url, filename) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch logo ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload("image", buffer, { filename });
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
}

const tools = [
  {
    _id: "tool-chatgpt",
    title: "ChatGPT",
    slug: "chatgpt",
    categoryId: "category-ai-chatbots",
    tagline:
      "The most popular AI chatbot for writing, research, and everyday tasks",
    shortDescription:
      "ChatGPT is OpenAI's flagship AI assistant, used by over 100 million people for writing, coding, research, summarizing, and more.",
    pricingModel: "Freemium",
    rating: 4.7,
    affiliateSlug: "chatgpt",
    officialUrl: "https://chat.openai.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
    pricingPlans: [
      {
        planName: "Free",
        price: "$0",
        features: [
          "GPT-4o mini access",
          "Basic chat",
          "Limited image uploads",
        ],
      },
      {
        planName: "Plus",
        price: "$20/month",
        features: [
          "GPT-4o access",
          "Faster responses",
          "Image generation via DALL·E",
          "File uploads",
          "Web browsing",
        ],
      },
      {
        planName: "Team",
        price: "$30/user/month",
        features: [
          "Everything in Plus",
          "Higher usage limits",
          "Admin controls",
          "No training on your data",
        ],
      },
    ],
    pros: [
      "Most capable general-purpose AI available",
      "Excellent at writing, summarizing, and explaining complex topics",
      "Strong coding ability (can write, debug, and explain code)",
      "Huge plugin/GPT ecosystem",
      "Reliable uptime and fast responses on Plus",
    ],
    cons: [
      "Free tier has strict usage limits",
      "Can confidently state incorrect information (hallucinations)",
      "No real-time internet access on free plan",
      "$20/month may feel steep for casual users",
    ],
    useCases: [
      "Content writing and editing",
      "Email drafting",
      "Coding help",
      "Research summarizing",
      "Learning new topics",
      "Customer support scripts",
    ],
    overview: [
      "ChatGPT by OpenAI is the AI assistant that brought conversational AI to the mainstream. Since its launch in late 2022, it has become the go-to tool for millions of writers, developers, students, and professionals who need a fast, reliable AI to think alongside them.",
      "At its core, ChatGPT excels at understanding nuanced instructions and producing high-quality text output. Whether you need a first draft of a blog post, a debugging session for your Python code, a summary of a long document, or just an explanation of a complex topic in plain language — ChatGPT handles all of it competently.",
      "The free tier runs on GPT-4o mini, which is capable for most everyday tasks. Upgrading to ChatGPT Plus ($20/month) unlocks the full GPT-4o model, noticeably stronger reasoning, image generation via DALL·E 3, the ability to upload and analyze files (PDFs, spreadsheets, images), and web browsing for up-to-date information.",
      "For developers and technical users, ChatGPT's code generation and debugging ability is impressive. It can write working code across most popular languages, explain what existing code does, suggest optimizations, and help spot bugs. It's not infallible — complex multi-file projects still need a specialized tool like Claude Code or GitHub Copilot — but for quick scripts and problem-solving, it's hard to beat.",
      "The main weakness to be aware of is hallucination: ChatGPT can produce confident-sounding wrong answers, especially for specific facts, statistics, or recent events. Always verify factual claims from critical content.",
      "Overall, ChatGPT is the safest \"first AI tool\" recommendation for anyone just getting started, and it remains one of the most capable options for experienced users who need a versatile general-purpose assistant.",
    ],
    faqs: [
      {
        question: "Is ChatGPT free to use?",
        answer:
          "Yes, ChatGPT has a free tier that gives access to GPT-4o mini with basic functionality. The paid Plus plan ($20/month) unlocks the full GPT-4o model, image generation, file uploads, and web browsing.",
      },
      {
        question: "Can ChatGPT browse the internet?",
        answer:
          "Yes, but only on the Plus plan or above. The free tier does not include web browsing, so its knowledge is limited to its training cutoff date.",
      },
      {
        question: "Is ChatGPT good for coding?",
        answer:
          "Yes — it handles writing, debugging, and explaining code across most popular languages well. For larger codebases or agentic coding tasks, a dedicated tool like GitHub Copilot or Claude Code may be more effective.",
      },
    ],
    relatedTools: ["tool-claude", "tool-midjourney"],
  },
  {
    _id: "tool-claude",
    title: "Claude",
    slug: "claude",
    categoryId: "category-ai-chatbots",
    tagline:
      "The best AI for long documents, nuanced writing, and thoughtful reasoning",
    shortDescription:
      "Claude is Anthropic's AI assistant, known for its long context window, nuanced writing quality, and careful, thoughtful responses.",
    pricingModel: "Freemium",
    rating: 4.6,
    affiliateSlug: "claude",
    officialUrl: "https://claude.ai",
    logoUrl: "https://www.google.com/s2/favicons?domain=claude.ai&sz=128",
    pricingPlans: [
      {
        planName: "Free",
        price: "$0",
        features: ["Access to Claude Sonnet", "Limited daily messages"],
      },
      {
        planName: "Pro",
        price: "$20/month",
        features: [
          "Priority access",
          "Higher usage limits",
          "Access to Claude Opus (most capable model)",
          "Extended thinking mode",
        ],
      },
      {
        planName: "Team",
        price: "$30/user/month",
        features: [
          "Everything in Pro",
          "Collaborative features",
          "Admin controls",
          "No training on your data",
        ],
      },
    ],
    pros: [
      "Exceptional writing quality — nuanced, natural, and well-structured",
      "Very large context window (can process extremely long documents)",
      "Excellent at careful reasoning and following complex instructions",
      "Strong coding ability, especially with Claude Code for agentic tasks",
      "Tends to be more honest about uncertainty than some competitors",
    ],
    cons: [
      "Free tier message limits can be restrictive during heavy use",
      "No image generation (unlike ChatGPT Plus)",
      "Fewer integrations and plugins compared to the ChatGPT ecosystem",
      "Web browsing not available on all plans",
    ],
    useCases: [
      "Long-form writing and editing",
      "Document analysis",
      "Legal/contract review",
      "Coding (especially with Claude Code)",
      "Research synthesis",
      "Nuanced creative writing",
    ],
    overview: [
      "Claude, built by Anthropic, is widely regarded as the strongest alternative to ChatGPT — and in many writing and reasoning tasks, users find it superior. Anthropic was founded by ex-OpenAI researchers with a focus on AI safety, and that philosophy shows in how Claude responds: it's notably more careful, more willing to say \"I'm not sure,\" and less likely to confidently make things up.",
      "Where Claude truly shines is writing quality. The output is more natural and nuanced than most AI tools — less \"AI-sounding,\" more like something a thoughtful human writer would produce. This makes it particularly valuable for content creators, journalists, and marketers who need polished output with minimal editing.",
      "Claude's context window — the amount of text it can process in a single conversation — is also among the largest available. This means you can paste in entire long documents (contracts, research papers, codebases) and have Claude analyze, summarize, or answer questions about the full content in one go. A capability that ChatGPT's standard plans don't match at the same scale.",
      "For developers, Claude Code (a separate command-line tool) takes Claude's coding ability into agentic territory — it can plan, write, and iterate on multi-file codebases with minimal hand-holding, making it one of the most powerful AI coding tools available.",
      "The main area where Claude trails ChatGPT is the broader ecosystem: fewer third-party integrations, no image generation built in, and a smaller library of pre-built \"modes\" or specialized assistants. If you need an all-in-one tool, ChatGPT may cover more ground. If you need the best writing and document understanding, Claude is hard to beat.",
    ],
    faqs: [
      {
        question: "What is Claude best at compared to ChatGPT?",
        answer:
          "Claude is generally considered better for long-form writing quality, document analysis (thanks to its large context window), and careful reasoning. ChatGPT has a broader ecosystem with image generation and more integrations.",
      },
      {
        question: "Is Claude safe to use for sensitive documents?",
        answer:
          "Anthropic has made safety a core part of Claude's design, and the Pro/Team plans include options for data not to be used for training. Always review Anthropic's current privacy policy for the latest terms before uploading sensitive material.",
      },
      {
        question: "What is Claude Code?",
        answer:
          "Claude Code is a separate command-line tool by Anthropic that lets Claude autonomously write, edit, and run code in your local environment — going beyond simple code generation into full agentic software development.",
      },
    ],
    relatedTools: ["tool-chatgpt", "tool-midjourney"],
  },
  {
    _id: "tool-midjourney",
    title: "Midjourney",
    slug: "midjourney",
    categoryId: "category-ai-image-generation",
    tagline: "The gold standard for high-quality AI image generation",
    shortDescription:
      "Midjourney is the leading AI image generator, known for producing stunning, artistic, high-quality images from text prompts.",
    pricingModel: "Paid",
    rating: 4.8,
    affiliateSlug: "midjourney",
    officialUrl: "https://www.midjourney.com",
    logoUrl:
      "https://www.google.com/s2/favicons?domain=midjourney.com&sz=128",
    pricingPlans: [
      {
        planName: "Basic",
        price: "$10/month",
        features: [
          "~200 image generations/month",
          "Access via Discord and web",
        ],
      },
      {
        planName: "Standard",
        price: "$30/month",
        features: ["Unlimited relaxed generations", "15 fast GPU hours"],
      },
      {
        planName: "Pro",
        price: "$60/month",
        features: ["30 fast GPU hours", "Stealth mode (private images)"],
      },
      {
        planName: "Mega",
        price: "$120/month",
        features: ["60 fast GPU hours", "Max priority"],
      },
    ],
    pros: [
      "Best overall image quality of any AI generator — consistently stunning results",
      "Exceptional at artistic, cinematic, and stylized imagery",
      "Active community with huge prompt inspiration resources",
      "Fast generation on higher plans",
      "Continuous model improvements (currently V6)",
    ],
    cons: [
      "No free plan — paid subscription required",
      "Less precise for photorealistic faces compared to some competitors",
      "Requires learning prompt syntax to get the best results",
      "Primarily operated through Discord (web interface still maturing)",
      "Cannot generate text accurately within images",
    ],
    useCases: [
      "Marketing visuals and thumbnails",
      "Concept art",
      "Social media graphics",
      "Mood boards",
      "Book covers",
      "Background art",
      "Brand identity exploration",
    ],
    overview: [
      "Midjourney is the AI image generator that professionals consistently choose when quality is the top priority. While tools like DALL·E 3 (built into ChatGPT) and Adobe Firefly offer more seamless integrations, Midjourney's output quality — particularly for artistic, cinematic, and stylized imagery — is in a class of its own.",
      "The tool has gone through rapid iteration since its launch, and the current V6 model produces images with remarkable detail, composition, and aesthetic coherence. Whether you're generating fantasy landscapes, product mockups, editorial illustrations, or abstract art, Midjourney's results are consistently impressive — often requiring little to no editing before use.",
      "The workflow is primarily Discord-based: you type /imagine [your prompt] in a Midjourney Discord server or channel, and the bot generates four image variations. You can then upscale, vary, or re-run any of them. A web interface is available and improving, but Discord remains the primary experience. If you're unfamiliar with Discord, there's a short learning curve — but the Midjourney community is extremely active and beginner-friendly.",
      "Prompt crafting is a skill in itself with Midjourney. The tool responds well to descriptive language about style, lighting, composition, and medium (e.g., \"cinematic photograph, golden hour, shallow depth of field, Kodak film grain\"). Investing time in learning prompt syntax pays off significantly in output quality.",
      "The one clear weakness is photorealistic human faces — Midjourney can produce beautiful portraits but sometimes struggles with accurate anatomy, especially hands and text rendering. For highly realistic human-focused content, tools like FLUX or Stable Diffusion with specific fine-tuned models may produce better results.",
      "No free plan means Midjourney isn't for casual experimentation — the $10/month Basic plan is the entry point. For professionals who use it regularly, the Standard plan's unlimited relaxed generations make it effectively unlimited for non-urgent work.",
    ],
    faqs: [
      {
        question: "Does Midjourney have a free trial?",
        answer:
          "Midjourney removed its free trial in 2023 due to high demand. A paid subscription starting at $10/month is required to generate images.",
      },
      {
        question: "Do I own the images I create with Midjourney?",
        answer:
          "On paid plans, you generally own the images you create (for commercial use). Free trial images are not commercially licensable. Always check Midjourney's current terms of service for the latest licensing details.",
      },
      {
        question: "Is Midjourney better than DALL·E 3?",
        answer:
          "For artistic and stylized imagery, most users and professionals rate Midjourney's output quality higher than DALL·E 3. DALL·E 3 has the advantage of being integrated directly into ChatGPT Plus, making it more convenient for users who already pay for that plan.",
      },
    ],
    relatedTools: ["tool-chatgpt", "tool-claude"],
  },
];

async function main() {
  console.log("Seeding categories...");
  for (const category of categories) {
    await client.createOrReplace(category);
    console.log(`  ✓ ${category.title}`);
  }

  // Pass 1: create every tool without relatedTools (references need their
  // targets to already exist, so we wire them up in pass 2).
  console.log("Seeding tools...");
  for (const tool of tools) {
    const logo = await uploadLogo(tool.logoUrl, `${tool.slug}-logo.png`);
    const doc = {
      _id: tool._id,
      _type: "tool",
      title: tool.title,
      slug: { _type: "slug", current: tool.slug },
      logo,
      shortDescription: tool.shortDescription,
      tagline: tool.tagline,
      category: { _type: "reference", _ref: tool.categoryId },
      pricingModel: tool.pricingModel,
      pricingPlans: tool.pricingPlans.map((plan, i) => ({
        _type: "pricingPlan",
        _key: `plan${i}`,
        ...plan,
      })),
      rating: tool.rating,
      pros: tool.pros,
      cons: tool.cons,
      useCases: tool.useCases,
      affiliateSlug: tool.affiliateSlug,
      officialUrl: tool.officialUrl,
      overview: blocks(tool.overview),
      faqs: tool.faqs.map((faq, i) => ({
        _type: "faq",
        _key: `faq${i}`,
        ...faq,
      })),
    };
    await client.createOrReplace(doc);
    console.log(`  ✓ ${tool.title}`);
  }

  // Pass 2: now that all tools exist, set relatedTools references.
  console.log("Linking related tools...");
  for (const tool of tools) {
    await client
      .patch(tool._id)
      .set({
        relatedTools: tool.relatedTools.map((ref, i) => ({
          _type: "reference",
          _key: `rt${i}`,
          _ref: ref,
        })),
      })
      .commit();
    console.log(`  ✓ ${tool.title} → [${tool.relatedTools.join(", ")}]`);
  }

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
