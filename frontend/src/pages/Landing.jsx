import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ArrowRight, Link2, Wand2, Download, FileText, MessageSquare,
  Briefcase, Camera, Mail, HelpCircle, BookOpen, Layers, CheckSquare,
  ListChecks, Video, GraduationCap, Megaphone, Users, Globe, SlidersHorizontal,
} from 'lucide-react';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useAuth } from '../context/AuthContext';
import { useContentTypes } from '../hooks/useContentTypes';
import { isValidYoutubeUrl } from '../lib/youtubeUrl';

const FORMAT_ICONS = {
  summary: FileText,
  blog: FileText,
  linkedin: Briefcase,
  twitter: MessageSquare,
  instagram: Camera,
  youtube_description: Video,
  email: Mail,
  faq: HelpCircle,
  key_takeaways: ListChecks,
  seo_pack: Globe,
  flashcards: Layers,
  action_items: CheckSquare,
  notes: BookOpen,
  mcq: GraduationCap,
};

const STEPS = [
  {
    icon: Link2,
    title: 'Paste a YouTube link',
    description: 'Any public video with captions available works — talks, tutorials, podcast episodes, lectures.',
  },
  {
    icon: Wand2,
    title: 'We pull and clean the transcript',
    description: 'The transcript is fetched and cleaned automatically. No manual copy-pasting from YouTube.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Pick formats and customize',
    description: 'Choose from 14 formats, set a tone, audience, language, and length — or generate several at once as a pack.',
  },
  {
    icon: Download,
    title: 'Edit, copy, or export',
    description: 'Refine anything inline, ask for a shorter or more detailed version, then copy it or export as Markdown or Word.',
  },
];

const USE_CASES = [
  {
    icon: Megaphone,
    title: 'Content creators',
    points: ['Turn one video into a week of social posts', 'Repurpose long-form content across platforms', 'Never stare at a blank caption box again'],
  },
  {
    icon: GraduationCap,
    title: 'Students',
    points: ['Turn lecture recordings into study notes', 'Generate flashcards and practice MCQs', 'Get key takeaways without rewatching'],
  },
  {
    icon: Users,
    title: 'Marketers',
    points: ['Draft SEO blog posts from webinars', 'Build a content pack in one click', 'Get keyword and meta description options'],
  },
  {
    icon: BookOpen,
    title: 'Educators',
    points: ['Convert lessons into written references', 'Auto-generate comprehension quizzes', 'Create FAQs for common student questions'],
  },
];

const FAQS = [
  {
    q: 'What kind of videos work with VidScribe?',
    a: 'Any public YouTube video that has captions available — either uploaded by the creator or YouTube\u2019s auto-generated captions. Videos without any captions available can\u2019t be processed, since there\u2019s no transcript to work from.',
  },
  {
    q: 'Is VidScribe free to use?',
    a: 'Yes — creating an account and generating content is free. VidScribe runs on a free-tier AI provider, so generation is subject to that provider\u2019s rate limits during heavy use.',
  },
  {
    q: 'What languages are supported?',
    a: 'You can request generated content in English, Hindi, or Marathi, or specify another language of your choice — quality will vary by language since it depends on the underlying AI model.',
  },
  {
    q: 'Can I edit the generated content?',
    a: 'Yes. Every generated piece can be edited and saved directly, regenerated with a different tone or length, or regenerated from scratch with new instructions.',
  },
  {
    q: 'What can I export?',
    a: 'Every format can be copied to your clipboard or downloaded as a Markdown (.md) or Word (.docx) file.',
  },
  {
    q: 'Is my data private?',
    a: 'Your account, processed videos, and generated content are only visible to you — access requires authentication, and every request is scoped to your account.',
  },
];

const Landing = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: typesData } = useContentTypes();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!isValidYoutubeUrl(url)) {
      setError('Please paste a valid YouTube URL.');
      return;
    }

    localStorage.setItem('pendingVideoUrl', url);
    navigate(user ? '/process' : '/register');
  };

  const grouped = (typesData?.types || []).reduce((acc, t) => {
    acc[t.categoryLabel] = acc[t.categoryLabel] || [];
    acc[t.categoryLabel].push(t);
    return acc;
  }, {});

  return (
    <div id="top" className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 pt-24 pb-8 text-center">
          <Badge variant="secondary" className="mb-6 font-mono text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            YouTube video-to-content converter
          </Badge>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-balance leading-[1.05]">
            Turn any YouTube video into <span className="font-heading italic font-semibold">content that publishes itself.</span>
          </h1>

          <p className="text-xl text-muted-foreground mt-7 max-w-2xl mx-auto text-balance">
            Paste a link. VidScribe pulls the transcript and turns it into blog posts, social
            captions, study notes, and more — ready to copy, edit, and publish.
          </p>

          <form onSubmit={handleSubmit} className="mt-9 max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="url"
                placeholder="Paste a YouTube video URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-13 text-base bg-card"
              />
              <Button type="submit" size="lg" className="h-13 shrink-0 text-base">
                Generate for free
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            {error && <p className="text-sm text-destructive mt-2 text-left">{error}</p>}
          </form>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-muted-foreground mt-5">
            <span>No credit card required</span>
            <span className="opacity-40">/</span>
            <span>Free to start</span>
            <span className="opacity-40">/</span>
            <span>14 content formats</span>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl sm:text-5xl font-black text-center mb-16 text-balance leading-tight">
            From link to ready-to-use content in <span className="font-heading italic font-semibold">four steps</span>.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="text-left">
                <div className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center mb-3">
                  <step.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg mb-1.5">{i + 1}. {step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Formats showcase — all 14 */}
        <section id="formats" className="bg-secondary/40 py-20">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl sm:text-5xl font-black text-center mb-16 text-balance leading-tight">
              Fourteen formats from <span className="font-heading italic font-semibold">one transcript</span>.
            </h2>

            {Object.entries(grouped).map(([category, types]) => (
              <div key={category} className="mb-9 last:mb-0">
                <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wide">{category}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {types.map((t) => {
                    const Icon = FORMAT_ICONS[t.id] || FileText;
                    return (
                      <Card key={t.id} className="border-border/60">
                        <CardContent className="p-4 flex items-center gap-3">
                          <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="text-sm font-semibold">{t.label}</span>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Use cases */}
        <section id="features" className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl sm:text-5xl font-black text-center mb-16 text-balance leading-tight">
            Built for creators, students, and <span className="font-heading italic font-semibold">teams</span>.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {USE_CASES.map((uc, i) => (
              <Card key={i} className="border-border/60">
                <CardContent className="p-5">
                  <uc.icon className="w-6 h-6 mb-3" />
                  <h3 className="font-bold text-lg mb-2">{uc.title}</h3>
                  <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside marker:text-muted-foreground/50">
                    {uc.points.map((p, j) => (
                      <li key={j}>{p}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-secondary/40 py-20">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl sm:text-5xl font-black text-center mb-16 text-balance leading-tight">
              Common <span className="font-heading italic font-semibold">questions</span>.
            </h2>
            <Accordion type="single" collapsible>
              {FAQS.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="font-bold text-left text-base">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-2xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl sm:text-5xl font-black mb-4 text-balance leading-tight">
            Paste a link — <span className="font-heading italic font-semibold">readable content</span> in seconds.
          </h2>
          <p className="text-lg text-muted-foreground mb-7">Free to start. No credit card required.</p>
          <Button size="lg" className="text-base h-13" asChild>
            <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              Get started
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
