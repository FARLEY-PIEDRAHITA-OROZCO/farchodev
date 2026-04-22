import React, { useState } from "react";
import axios from "axios";
import { profile } from "../data/mock";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "../hooks/use-toast";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Send, Terminal } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handle = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa nombre, email y mensaje."
      });
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, form, { timeout: 10000 });
      toast({
        title: "Mensaje enviado ✓",
        description: "Gracias por tu mensaje. Te responderé pronto."
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      try {
        const stored = JSON.parse(localStorage.getItem("farley_messages") || "[]");
        stored.push({ ...form, date: new Date().toISOString(), offline: true });
        localStorage.setItem("farley_messages", JSON.stringify(stored));
      } catch (_) {
        /* ignore */
      }
      toast({
        title: "Error al enviar",
        description:
          err?.response?.data?.detail ||
          "No pudimos enviar ahora. Tu mensaje se guardó localmente."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-28 px-6 lg:px-10 bg-[#070A14]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest">
              <span className="w-8 h-px bg-cyan-400" />
              06 — Contacto
            </div>
            <h2 className="text-4xl lg:text-5xl font-semibold text-white leading-tight">
              Hablemos de <br />
              <span className="text-slate-400">tu próximo proyecto</span>
            </h2>
            <p className="text-slate-400 leading-relaxed">
              ¿Tienes un proyecto de testing, automatización o quieres colaborar
              en investigación de seguridad? Estoy abierto a conversaciones.
            </p>

            <div className="space-y-3 pt-2">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-cyan-300" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Email</div>
                  <div className="text-sm text-white group-hover:text-cyan-300 transition-colors">{profile.email}</div>
                </div>
              </a>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-cyan-300" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Teléfono</div>
                  <div className="text-sm text-white">{profile.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-cyan-300" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Ubicación</div>
                  <div className="text-sm text-white">{profile.location}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              {[
                { icon: Github, href: profile.social.github },
                { icon: Linkedin, href: profile.social.linkedin },
                { icon: Twitter, href: profile.social.twitter },
                { icon: Terminal, href: profile.social.tryhackme }
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 hover:text-cyan-300 text-slate-300 flex items-center justify-center transition-colors"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="lg:col-span-3 p-8 rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 space-y-5"
          >
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-300">
              <Terminal className="w-3.5 h-3.5" />
              <span>~/contact $ compose_message.sh</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Nombre
                </label>
                <Input
                  value={form.name}
                  onChange={handle("name")}
                  placeholder="Tu nombre"
                  className="bg-white/[0.03] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-cyan-400/40 focus-visible:border-cyan-400/40"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Email
                </label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={handle("email")}
                  placeholder="you@example.com"
                  className="bg-white/[0.03] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-cyan-400/40 focus-visible:border-cyan-400/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Asunto
              </label>
              <Input
                value={form.subject}
                onChange={handle("subject")}
                placeholder="¿De qué hablamos?"
                className="bg-white/[0.03] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-cyan-400/40 focus-visible:border-cyan-400/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Mensaje
              </label>
              <Textarea
                rows={6}
                value={form.message}
                onChange={handle("message")}
                placeholder="Cuéntame sobre tu proyecto..."
                className="bg-white/[0.03] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-cyan-400/40 focus-visible:border-cyan-400/40"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-medium"
            >
              {loading ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar mensaje
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
