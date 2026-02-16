"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, Pause, Play, ChevronDown, Sparkles, Church, PartyPopper, Shirt, Gift, Copy, Check, Star, Heart, Camera, ImageIcon, X, ExternalLink } from "lucide-react";

// Variantes para Framer Motion
const fadeInUp = {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0 },
};
const staggerContainer = {
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const staggerItem = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
const modalBackdrop = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
const modalPanel = { hidden: { opacity: 0, scale: 0.95, y: 20 }, visible: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 20 } };

const CONFIG = {
    nombre: "Nazarena",
    fechaEvento: new Date("2026-04-11T22:00:00"),
    misa: { fecha: "16 de Marzo de 2026", hora: "20:00 hs", lugar: "Parroquia María Reina", direccion: "El Manantial, Tucumán", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Parroquia+Maria+Reina+El+Manantial+Tucuman" },
    fiesta: { hora: "22:00 hs", lugar: "Salón de Fiestas", direccion: "Narcizo Eventos, Lules, Tucumán", mapsUrl: "https://www.google.com/maps/search/?api=1&query=+Narcizo+Eventos+Lules+Tucuman" },
    dressCode: "Elegante",
    dressCodeNota: "La gama del color celeste se reserva para la quinceañera.",
    fechaLimiteConfirmacion: "Viernes 13 de Marzo de 2026",
    regalo: { alias: "nazamedina16" },
    fotos: [
        "https://i.ibb.co/gZWwjfND/Whats-App-Image-2026-02-15-at-17-21-46-1.jpg",
        "https://i.ibb.co/LXjDSTWj/Whats-App-Image-2026-02-15-at-17-21-34.jpg",
        "https://i.ibb.co/93mW1xL3/Whats-App-Image-2026-02-15-at-17-21-45.jpg",
        "https://i.ibb.co/9HzWHJkq/Whats-App-Image-2026-02-15-at-17-21-46.jpg",
    ],
    quiz: [
        { pregunta: "¿Cuál es mi chocolate favorito?", opciones: ["Dos corazones", "Block", "Milka", "Bon o Bon"], respuestaCorrecta: 0 },
        { pregunta: "¿Qué me gustaría ser de grande?", opciones: ["Médica", "Psicóloga", "Abogada", "Veterinaria"], respuestaCorrecta: 1 },
        { pregunta: "¿Cuál es la fecha de mi cumple?", opciones: ["16 de Marzo", "26 de Marzo", "16 de Mayo", "6 de Marzo"], respuestaCorrecta: 0 },
    ],
};

export default function TarjetaNaza() {
    const [showContent, setShowContent] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [countdown, setCountdown] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
    const [showAlbumModal, setShowAlbumModal] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = CONFIG.fechaEvento.getTime() - now;
            if (distance > 0) {
                setCountdown({
                    dias: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    horas: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutos: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    segundos: Math.floor((distance % (1000 * 60)) / 1000),
                });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetch("/audio/frozen-vuelie.mp3", { method: "HEAD" }).then((r) => {
            if (r.ok) { audioRef.current = new Audio("/audio/frozen-vuelie.mp3"); audioRef.current.loop = true; audioRef.current.volume = 0.5; }
        }).catch(() => { });
        return () => { if (audioRef.current) { audioRef.current.pause(); } };
    }, []);

    const toggleMusic = () => {
        if (!audioRef.current) return;
        if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
        else { audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { }); }
    };

    const handleEnter = () => {
        setShowContent(true);
        if (audioRef.current) audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
    };

    if (!showContent) {
        return (
            <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#0a1628] via-[#1a3a5c] to-[#2d5a7b]">
                <StarsBackground /><MagicParticles /><Snowflakes />
                <motion.div
                    className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div className="mb-6 w-40 h-40" variants={staggerItem} transition={{ type: "spring", stiffness: 100, damping: 14 }}>
                        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}><CastleSVG /></motion.div>
                    </motion.div>
                    <motion.div className="text-center mb-6" variants={staggerItem}>
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <SnowflakeIcon className="w-5 h-5 text-[#87CEEB] animate-spin-slow" />
                            <p className="text-[#87CEEB] text-xs tracking-[0.4em] uppercase">Estás invitado a</p>
                            <SnowflakeIcon className="w-5 h-5 text-[#87CEEB] animate-spin-slow" />
                        </div>
                        <h1 className="text-5xl md:text-7xl text-white mb-2 frozen-title">MIS <span className="text-[#87CEEB]">XV</span></h1>
                        <h2 className="text-4xl md:text-6xl text-[#E0F4FF] mt-3 frozen-name">{CONFIG.nombre}</h2>
                    </motion.div>
                    <motion.p className="text-[#B0D4E8] text-center max-w-xs mb-8 text-sm leading-relaxed" variants={staggerItem}>Quiero que seas parte de este momento tan mágico para mí</motion.p>
                    <motion.button
                        onClick={handleEnter}
                        className="px-10 py-4 rounded-full bg-gradient-to-r from-[#1e90ff] to-[#4169e1] text-white font-medium tracking-widest uppercase text-sm shadow-[0_0_30px_rgba(30,144,255,0.5)] border border-white/20"
                        variants={staggerItem}
                        whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(30,144,255,0.6)" }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="flex items-center gap-3"><SnowflakeIcon className="w-4 h-4" />Abrir invitación<SnowflakeIcon className="w-4 h-4" /></span>
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#E8F4FC] to-[#B7D0E1] relative overflow-x-hidden">
            <motion.button
                onClick={toggleMusic}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#1e90ff] to-[#0a4d8c] shadow-lg flex items-center justify-center border-2 border-white/30"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-1" />}
            </motion.button>
            <AnimatePresence mode="wait">
                {showAlbumModal && <AlbumModal key="album-modal" onClose={() => setShowAlbumModal(false)} />}
            </AnimatePresence>
            <Section1Portada countdown={countdown} />
            <Section2Fecha />
            <Section3Lugar />
            <Section4DressCode />
            <Section5Fotos1 />
            <Section6Frase />
            <Section7Album onOpen={() => setShowAlbumModal(true)} />
            <Section8Regalo />
            <Section9Fotos2 />
            <Section10Quiz />
            <Section11Confirmacion />
            <Section12Despedida />
            <Footer />
        </div>
    );
}

function Section1Portada({ countdown }: { countdown: { dias: number; horas: number; minutos: number; segundos: number } }) {
    const items = [{ v: countdown.dias, l: "Dias" }, { v: countdown.horas, l: "Horas" }, { v: countdown.minutos, l: "Min" }, { v: countdown.segundos, l: "Seg" }];
    return (
        <section className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#0a1628] via-[#1a3a5c] to-[#5F84A2]">
            <StarsBackground /><MagicParticles /><Snowflakes />
            <motion.div
                className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10 py-20"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
                <motion.div className="mb-4 w-28 h-28" variants={staggerItem}><CastleSVG /></motion.div>
                <motion.div className="text-center mb-8" variants={staggerItem}>
                    <p className="text-[#87CEEB] text-xs tracking-[0.4em] uppercase mb-2">Celebremos juntos</p>
                    <h1 className="text-4xl md:text-6xl text-white frozen-title">MIS <span className="text-[#87CEEB]">XV</span></h1>
                    <h2 className="text-5xl md:text-7xl text-[#E0F4FF] mt-2 frozen-name">{CONFIG.nombre}</h2>
                </motion.div>
                <motion.div className="grid grid-cols-4 gap-3 md:gap-6 mb-10" variants={staggerContainer}>
                    {items.map((item, i) => (
                        <motion.div key={i} className="flex flex-col items-center" variants={staggerItem} whileHover={{ scale: 1.05 }}>
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(255,255,255,0.08)]">
                                <span className="text-2xl md:text-3xl font-bold text-white">{item.v.toString().padStart(2, "0")}</span>
                            </div>
                            <span className="text-[#87CEEB] text-xs uppercase">{item.l === "Dias" ? "Días" : item.l}</span>
                        </motion.div>
                    ))}
                </motion.div>
                <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-8">
                    <ChevronDown className="w-8 h-8 text-white/60" />
                </motion.div>
            </motion.div>
        </section>
    );
}

function Section2Fecha() {
    return (
        <motion.section
            className="frozen-section py-20 px-6 bg-gradient-to-b from-[#5F84A2] to-[#91AEC4]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
        >
            <motion.div className="max-w-md mx-auto text-center" variants={staggerItem}>
                <div className="frozen-divider"><SnowflakeIcon className="w-4 h-4 text-white/70" /></div>
                <motion.div className="w-20 h-20 rounded-full bg-white/25 flex items-center justify-center mx-auto mb-6 border-2 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.2)]" whileHover={{ scale: 1.05 }}>
                    <Calendar className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-2xl text-white mb-6 frozen-title">FECHA DEL EVENTO</h3>
                <motion.div className="frozen-card bg-white/25 backdrop-blur-sm rounded-3xl p-8 border-2 border-white/30 shadow-xl" whileHover={{ scale: 1.02 }}>
                    <p className="text-5xl text-white frozen-name">16</p>
                    <p className="text-xl text-[#E0F4FF] mt-2">de Marzo</p>
                    <p className="text-3xl text-white mt-2 frozen-title">2026</p>
                </motion.div>
            </motion.div>
        </motion.section>
    );
}

function Section3Lugar() {
    return (
        <motion.section
            className="frozen-section py-20 px-6 bg-[#91AEC4]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
        >
            <motion.div className="max-w-md mx-auto space-y-10" variants={staggerItem}>
                <div className="frozen-divider"><SnowflakeIcon className="w-4 h-4 text-white/70" /></div>
                <motion.div variants={staggerItem}>
                    <div className="w-16 h-16 rounded-full bg-white/25 flex items-center justify-center mx-auto mb-4 border-2 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        <Church className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-center text-xl text-white mb-4 frozen-title">CEREMONIA RELIGIOSA</h3>
                    <motion.div className="frozen-card-light bg-white/80 rounded-3xl p-5 text-center border border-white/60" whileHover={{ y: -2, boxShadow: "0 12px 40px rgba(30,144,255,0.15)" }}>
                        <p className="text-[#194569] font-semibold text-lg">{CONFIG.misa.lugar}</p>
                        <p className="text-[#5F84A2] text-sm">{CONFIG.misa.direccion}</p>
                        <div className="flex items-center justify-center gap-2 text-[#194569] mt-2"><Clock className="w-4 h-4 text-[#1e90ff]" />{CONFIG.misa.hora}</div>
                        <a href={CONFIG.misa.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-4 w-full py-3 rounded-full bg-gradient-to-r from-[#1e90ff] to-[#4169e1] text-white flex items-center justify-center gap-2 text-sm">
                            <MapPin className="w-4 h-4" />CÓMO LLEGAR
                        </a>
                    </motion.div>
                </motion.div>
                <motion.div variants={staggerItem}>
                    <div className="w-16 h-16 rounded-full bg-white/25 flex items-center justify-center mx-auto mb-4 border-2 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        <PartyPopper className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-center text-xl text-white mb-4 frozen-title">FIESTA</h3>
                    <motion.div className="frozen-card-light bg-white/80 rounded-3xl p-5 text-center border border-white/60" whileHover={{ y: -2, boxShadow: "0 12px 40px rgba(30,144,255,0.15)" }}>
                        <p className="text-[#194569] font-semibold text-lg">{CONFIG.fiesta.lugar}</p>
                        <p className="text-[#5F84A2] text-sm">{CONFIG.fiesta.direccion}</p>
                        <div className="flex items-center justify-center gap-2 text-[#194569] mt-2"><Clock className="w-4 h-4 text-[#1e90ff]" />{CONFIG.fiesta.hora}</div>
                        <a href={CONFIG.fiesta.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-4 w-full py-3 rounded-full bg-gradient-to-r from-[#1e90ff] to-[#4169e1] text-white flex items-center justify-center gap-2 text-sm">
                            <MapPin className="w-4 h-4" />CÓMO LLEGAR
                        </a>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.section>
    );
}

function Section4DressCode() {
    return (
        <motion.section
            className="frozen-section py-20 px-6 bg-gradient-to-b from-[#91AEC4] to-[#B7D0E1]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
        >
            <motion.div className="max-w-md mx-auto text-center" variants={staggerItem}>
                <div className="frozen-divider frozen-divider-light"><SnowflakeIcon className="w-4 h-4 text-[#194569]/60" /></div>
                <div className="w-20 h-20 rounded-full bg-[#1e90ff]/20 flex items-center justify-center mx-auto mb-6 border-2 border-[#5F84A2]/40 shadow-[0_0_20px_rgba(30,144,255,0.15)]">
                    <Shirt className="w-10 h-10 text-[#194569]" />
                </div>
                <h3 className="text-2xl text-[#194569] mb-4 frozen-title">DRESS CODE</h3>
                <p className="text-5xl text-[#1e90ff] frozen-name mb-4">{CONFIG.dressCode}</p>
                <div className="flex justify-center">
                    <div className="inline-flex items-center justify-center gap-2 bg-[#194569]/10 rounded-full px-6 py-3 border border-[#194569]/20">
                        <span className="text-[#194569] text-sm font-medium whitespace-nowrap">{CONFIG.dressCodeNota}</span>
                    </div>
                </div>
            </motion.div>
        </motion.section>
    );
}

function Section5Fotos1() {
    return (
        <motion.section
            className="frozen-section py-20 px-6 bg-[#B7D0E1]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
        >
            <motion.div className="max-w-lg mx-auto grid grid-cols-2 gap-5" variants={staggerContainer}>
                {CONFIG.fotos.slice(0, 2).map((foto, i) => (
                    <motion.div
                        key={i}
                        className="relative aspect-[3/4] rounded-2xl overflow-hidden frozen-card border-4 border-white/60"
                        variants={staggerItem}
                        whileHover={{ scale: 1.03, boxShadow: "0 24px 48px rgba(30,144,255,0.25)" }}
                    >
                        <img src={foto} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                        <SnowflakeIcon className="w-5 h-5 text-white/80 absolute top-2 right-2 animate-spin-slow" />
                    </motion.div>
                ))}
            </motion.div>
        </motion.section>
    );
}

function Section6Frase() {
    return (
        <motion.section
            className="frozen-section py-20 px-6 bg-gradient-to-b from-[#B7D0E1] to-[#91AEC4]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
        >
            <motion.div className="max-w-md mx-auto text-center" variants={staggerItem}>
                <div className="frozen-divider frozen-divider-light"><Star className="w-5 h-5 text-[#1e90ff]/80" /></div>
                <SnowflakeIcon className="w-8 h-8 text-[#1e90ff] mx-auto mb-6" />
                <p className="text-[#194569] text-lg md:text-xl leading-relaxed italic font-medium">
                    &quot;Hay momentos que no se pueden borrar, personas que no se pueden olvidar y recuerdos como estos que siempre voy a atesorar.&quot;
                </p>
                <Star className="w-5 h-5 text-[#1e90ff] mx-auto mt-6" />
            </motion.div>
        </motion.section>
    );
}

function Section7Album({ onOpen }: { onOpen: () => void }) {
    return (
        <motion.section
            className="frozen-section py-20 px-6 bg-[#91AEC4]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
        >
            <motion.div className="max-w-md mx-auto text-center" variants={staggerItem}>
                <div className="frozen-divider"><SnowflakeIcon className="w-4 h-4 text-white/70" /></div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400/40 to-pink-400/40 flex items-center justify-center mx-auto mb-6 border-2 border-white/40 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                    <Camera className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl text-white mb-2 frozen-title">ÁLBUM</h3>
                <p className="text-[#E0F4FF] text-lg mb-4 frozen-name">¡Quiero ver tus fotos!</p>
                <p className="text-white/80 text-sm mb-6">Podés subir todas tus fotos del evento a mi álbum compartido</p>
                <motion.button onClick={onOpen} className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <ImageIcon className="w-5 h-5" />IR AL ÁLBUM<ExternalLink className="w-4 h-4" />
                </motion.button>
            </motion.div>
        </motion.section>
    );
}

function AlbumModal({ onClose }: { onClose: () => void }) {
    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalBackdrop}
            transition={{ duration: 0.2 }}
        >
            <motion.div
                className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                variants={modalPanel}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2"><Camera className="w-6 h-6 text-[#1e90ff]" /><h3 className="text-xl font-bold text-[#194569]">Álbum compartido</h3></div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
                </div>
                <div className="space-y-4 text-[#194569]">
                    <p className="text-lg font-semibold text-[#1e90ff]">¡Bienvenidos al álbum compartido!</p>
                    <p className="text-sm">En este espacio van a poder revivir los momentos más especiales a través de las fotos que suban los invitados.</p>
                    <p className="text-sm">El día de la fiesta tendrán un código QR que podrán mostrar para que todos puedan subir sus fotos en tiempo real.</p>
                    <p className="text-sm">Así, cada sonrisa, cada abrazo y cada detalle quedará guardado para siempre.</p>
                    <p className="text-center text-[#1e90ff] font-semibold">¡Un recuerdo único hecho entre todos!</p>
                </div>
                <motion.button onClick={onClose} className="mt-6 w-full py-3 rounded-full bg-gradient-to-r from-[#1e90ff] to-[#4169e1] text-white font-medium" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Entendido</motion.button>
            </motion.div>
        </motion.div>
    );
}

function Section8Regalo() {
    const [copied, setCopied] = useState(false);
    const [show, setShow] = useState(false);
    const copy = () => { navigator.clipboard.writeText(CONFIG.regalo.alias); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    return (
        <motion.section
            className="frozen-section py-20 px-6 bg-gradient-to-b from-[#91AEC4] to-[#B7D0E1]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
        >
            <motion.div className="max-w-md mx-auto" variants={staggerItem}>
                <div className="frozen-divider frozen-divider-light"><SnowflakeIcon className="w-4 h-4 text-[#194569]/60" /></div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br flex items-center justify-center mx-auto mb-6 border-2 border-yellow-400/40 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                    <Gift className="w-10 h-10 text-[#194569]" />
                </div>
                <h3 className="text-center text-2xl text-[#194569] mb-6 frozen-title">REGALO</h3>
                <div className="frozen-card-light bg-white/40 backdrop-blur-md rounded-3xl p-6 text-center border border-white/50 shadow-[0_8px_32px_rgba(25,69,105,0.12)]">
                    <p className="text-[#194569] mb-6">Nada es más importante que tu presencia, pero si deseás hacerme un regalo será recibido con mucho amor. También podés hacerlo en la siguiente cuenta:</p>
                    {!show ? (
                        <button onClick={() => setShow(true)} className="px-8 py-3 rounded-full bg-gradient-to-r from-[#1e90ff] to-[#4169e1] text-white font-medium">VER CUENTA</button>
                    ) : (
                        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between gap-4 border border-white/40">
                            <div className="text-left"><p className="text-xs text-[#5F84A2] uppercase">Alias</p><p className="text-xl font-bold text-[#194569]">{CONFIG.regalo.alias}</p></div>
                            <button onClick={copy} className={`w-12 h-12 rounded-full flex items-center justify-center ${copied ? "bg-green-500" : "bg-[#1e90ff]"} text-white`}>
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                    )}
                    {copied && <p className="text-green-600 text-sm mt-3">¡Alias copiado!</p>}
                </div>
            </motion.div>
        </motion.section>
    );
}

function Section9Fotos2() {
    return (
        <motion.section
            className="frozen-section py-20 px-6 bg-[#B7D0E1]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
        >
            <motion.div className="max-w-lg mx-auto" variants={staggerItem}>
                <div className="grid grid-cols-2 gap-5 mb-12">
                    {CONFIG.fotos.slice(2, 4).map((foto, i) => (
                        <motion.div
                            key={i}
                            className="relative aspect-[3/4] rounded-2xl overflow-hidden frozen-card border-4 border-white/60"
                            variants={staggerItem}
                            whileHover={{ scale: 1.03, boxShadow: "0 24px 48px rgba(30,144,255,0.25)" }}
                        >
                            <img src={foto} alt={`Foto ${i + 3}`} className="w-full h-full object-cover" />
                            <SnowflakeIcon className="w-5 h-5 text-white/80 absolute top-2 left-2 animate-spin-slow" />
                        </motion.div>
                    ))}
                </div>
                <motion.div className="text-center" variants={staggerItem}>
                    <Sparkles className="w-6 h-6 text-[#1e90ff] mx-auto mb-4" />
                    <p className="text-[#194569] text-xl frozen-name">Preparate para una noche</p>
                    <p className="text-[#1e90ff] text-3xl md:text-4xl frozen-title mt-2">¡INOLVIDABLE!</p>
                </motion.div>
            </motion.div>
        </motion.section>
    );
}

function Section10Quiz() {
    const [curr, setCurr] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [done, setDone] = useState(false);
    const [score, setScore] = useState(0);

    const answer = (idx: number) => {
        const newA = [...answers, idx];
        setAnswers(newA);
        if (curr < CONFIG.quiz.length - 1) setTimeout(() => setCurr(curr + 1), 800);
        else { setScore(newA.reduce((a, ans, i) => a + (ans === CONFIG.quiz[i].respuestaCorrecta ? 1 : 0), 0)); setTimeout(() => setDone(true), 800); }
    };
    const reset = () => { setCurr(0); setAnswers([]); setDone(false); setScore(0); };
    const q = CONFIG.quiz[curr];
    const answered = answers.length > curr;

    return (
        <motion.section
            className="frozen-section py-20 px-6 bg-gradient-to-b from-[#B7D0E1] to-[#91AEC4]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
        >
            <motion.div className="max-w-md mx-auto" variants={staggerItem}>
                <div className="frozen-divider frozen-divider-light"><SnowflakeIcon className="w-4 h-4 text-[#194569]/60" /></div>
                <div className="w-20 h-20 rounded-full bg-[#1e90ff]/25 flex items-center justify-center mx-auto mb-6 text-3xl border-2 border-[#1e90ff]/30 shadow-[0_0_20px_rgba(30,144,255,0.15)]">🎮</div>
                <h3 className="text-center text-2xl text-[#194569] frozen-title mb-2">¿CUÁNTO ME CONOCÉS?</h3>
                <p className="text-center text-[#5F84A2] text-sm mb-8">¡Juguemos un poco!</p>
                {!done ? (
                    <div className="frozen-card-light bg-white/85 rounded-3xl p-6 border border-white/80">
                        <div className="flex justify-center gap-2 mb-6">
                            {CONFIG.quiz.map((_, i) => (<div key={i} className={`w-3 h-3 rounded-full ${i < answers.length ? "bg-[#1e90ff]" : i === curr ? "bg-[#1e90ff]/50 scale-125" : "bg-gray-300"}`} />))}
                        </div>
                        <h4 className="text-xl text-[#194569] text-center mb-6 font-medium">{q.pregunta}</h4>
                        <div className="space-y-3">
                            {q.opciones.map((op, i) => {
                                const sel = answered && answers[curr] === i;
                                const correct = i === q.respuestaCorrecta;
                                const showG = answered && correct;
                                const showR = sel && !correct;
                                return (
                                    <motion.button key={i} onClick={() => !answered && answer(i)} disabled={answered}
                                        className={`w-full p-4 rounded-2xl text-left border-2 ${showG ? "bg-green-100 border-green-400 text-green-700" : showR ? "bg-red-100 border-red-400 text-red-700" : "bg-white/50 border-gray-200 text-[#194569] hover:border-[#1e90ff]"}`}
                                        whileHover={!answered ? { scale: 1.02 } : {}}
                                        whileTap={!answered ? { scale: 0.98 } : {}}
                                    >
                                        <span className="flex items-center gap-3">
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${showG ? "bg-green-400 text-white" : showR ? "bg-red-400 text-white" : "bg-gray-200"}`}>{String.fromCharCode(65 + i)}</span>
                                            {op}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <motion.div className="frozen-card-light bg-white/85 rounded-3xl p-8 text-center border border-white/80" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", damping: 20 }}>
                        <div className="text-6xl mb-4">{score === 3 ? "🎉" : score >= 2 ? "😊" : "🤔"}</div>
                        <h4 className="text-2xl text-[#194569] font-bold mb-2">{score === 3 ? "¡Perfecto!" : score >= 2 ? "¡Muy bien!" : "¡A seguir intentando!"}</h4>
                        <div className="text-4xl font-bold text-[#1e90ff] mb-6">{score} / 3</div>
                        <motion.button onClick={reset} className="px-8 py-3 rounded-full bg-gradient-to-r from-[#1e90ff] to-[#4169e1] text-white font-medium" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>Jugar de nuevo</motion.button>
                    </motion.div>
                )}
            </motion.div>
        </motion.section>
    );
}

function Section11Confirmacion() {
    const [form, setForm] = useState({ cant: "1", inv: [{ nombre: "", apellido: "", confirma: true, alim: "ninguno", cancion: "" }] });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const changeCant = (c: string) => {
        const n = parseInt(c);
        setForm({ cant: c, inv: Array.from({ length: n }, (_, i) => form.inv[i] || { nombre: "", apellido: "", confirma: true, alim: "ninguno", cancion: "" }) });
    };
    const changeInv = (i: number, f: string, v: string | boolean) => {
        const newInv = [...form.inv];
        newInv[i] = { ...newInv[i], [f]: v };
        setForm({ ...form, inv: newInv });
    };
    const submit = async () => { setSending(true); await new Promise(r => setTimeout(r, 1500)); console.log(form); setSent(true); setSending(false); };

    if (sent) return (
        <section className="frozen-section py-20 px-6 bg-gradient-to-b from-[#91AEC4] to-[#5F84A2]">
            <div className="max-w-md mx-auto text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1e90ff] to-[#4169e1] mx-auto mb-6 flex items-center justify-center"><Sparkles className="w-12 h-12 text-white" /></div>
                <h3 className="text-2xl text-white frozen-title mb-4">¡Gracias por confirmar!</h3>
                <p className="text-[#D8ECF4]">Tu confirmación ha sido registrada. ¡Te esperamos!</p>
            </div>
        </section>
    );

    return (
        <motion.section
            className="frozen-section py-20 px-6 bg-gradient-to-b from-[#91AEC4] to-[#5F84A2]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
        >
            <motion.div className="max-w-md mx-auto" variants={staggerItem}>
                <div className="frozen-divider"><SnowflakeIcon className="w-4 h-4 text-white/70" /></div>
                <div className="w-20 h-20 rounded-full bg-white/25 flex items-center justify-center mx-auto mb-6 border-2 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-center text-2xl text-white frozen-title mb-2">CONFIRMA TU ASISTENCIA</h3>
                <p className="text-center text-[#D8ECF4] text-sm mb-8">Antes del {CONFIG.fechaLimiteConfirmacion}</p>
                <div className="bg-gradient-to-br from-[#1e90ff]/80 to-[#4169e1]/80 rounded-3xl p-6 border border-white/20">
                    <div className="mb-6">
                        <label className="block text-white/90 text-sm mb-2">Número de personas</label>
                        <select value={form.cant} onChange={(e) => changeCant(e.target.value)} className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white">
                            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n} className="text-[#194569]">{n} {n === 1 ? "persona" : "personas"}</option>)}
                        </select>
                    </div>
                    {form.inv.map((inv, i) => (
                        <div key={i} className="mb-6 pb-6 border-b border-white/20 last:border-0">
                            <p className="text-white font-medium mb-4 flex items-center gap-2"><SnowflakeIcon className="w-4 h-4 text-[#87CEEB]" />Invitado {i + 1}</p>
                            <div className="space-y-4">
                                <input type="text" placeholder="Nombre *" value={inv.nombre} onChange={e => changeInv(i, "nombre", e.target.value)} className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-white/60" />
                                <input type="text" placeholder="Apellido *" value={inv.apellido} onChange={e => changeInv(i, "apellido", e.target.value)} className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-white/60" />
                                <div>
                                    <p className="text-white/90 text-sm mb-2">¿Confirmás tu asistencia?</p>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 text-white cursor-pointer"><input type="radio" name={`c${i}`} checked={inv.confirma} onChange={() => changeInv(i, "confirma", true)} className="w-4 h-4" />¡Confirmo!</label>
                                        <label className="flex items-center gap-2 text-white cursor-pointer"><input type="radio" name={`c${i}`} checked={!inv.confirma} onChange={() => changeInv(i, "confirma", false)} className="w-4 h-4" />No podré</label>
                                    </div>
                                </div>
                                <select value={inv.alim} onChange={e => changeInv(i, "alim", e.target.value)} className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white">
                                    <option value="ninguno" className="text-[#194569]">Sin requerimiento</option>
                                    <option value="vegetariano" className="text-[#194569]">Vegetariano</option>
                                    <option value="vegano" className="text-[#194569]">Vegano</option>
                                    <option value="celiaco" className="text-[#194569]">Celiaco</option>
                                </select>
                                <input type="text" placeholder="¿Canción que no puede faltar?" value={inv.cancion} onChange={e => changeInv(i, "cancion", e.target.value)} className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-white/60" />
                            </div>
                        </div>
                    ))}
                    <motion.button onClick={submit} disabled={sending} className="w-full py-4 mt-4 rounded-full bg-white text-[#1e90ff] font-semibold flex items-center justify-center gap-2 disabled:opacity-70" whileHover={!sending ? { scale: 1.02 } : {}} whileTap={!sending ? { scale: 0.98 } : {}}>
                        {sending ? <><div className="w-5 h-5 border-2 border-[#1e90ff] border-t-transparent rounded-full animate-spin" />Enviando...</> : <><SnowflakeIcon className="w-5 h-5" />Confirmar</>}
                    </motion.button>
                </div>
            </motion.div>
        </motion.section>
    );
}

function Section12Despedida() {
    return (
        <motion.section
            className="frozen-section py-24 px-6 bg-gradient-to-b from-[#5F84A2] to-[#0a1628] relative overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
        >
            <StarsBackground /><MagicParticles /><Snowflakes />
            <motion.div className="max-w-md mx-auto text-center relative z-10" variants={staggerItem}>
                <div className="w-32 h-32 mx-auto mb-8 opacity-80"><CastleSVG /></div>
                <p className="text-2xl text-[#E0F4FF] frozen-title mb-4">Te espero</p>
                <h2 className="text-5xl md:text-6xl text-white frozen-name">{CONFIG.nombre}</h2>
                <div className="mt-12 flex justify-center gap-4">
                    <SnowflakeIcon className="w-6 h-6 text-[#87CEEB]/60 animate-spin-slow" />
                    <Heart className="w-8 h-8 text-pink-300/80 animate-pulse" />
                    <SnowflakeIcon className="w-6 h-6 text-[#87CEEB]/60 animate-spin-slow" />
                </div>
            </motion.div>
        </motion.section>
    );
}

function Footer() {
    return (
        <motion.footer
            className="py-8 px-6 bg-[#0a1628] text-center border-t border-white/10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <p className="text-[#87CEEB]/90 text-sm flex items-center justify-center gap-2 flex-wrap">
                
                Desarrollado por Agustina Gomez
                
            </p>
            
        </motion.footer>
    );
}

// COMPONENTES DECORATIVOS
function Snowflakes() {
    const [flakes, setFlakes] = useState<Array<{ id: number; left: number; delay: number; dur: number; size: number }>>([]);
    useEffect(() => { setFlakes(Array.from({ length: 30 }, (_, i) => ({ id: i, left: Math.random() * 100, delay: Math.random() * 10, dur: 8 + Math.random() * 10, size: 2 + Math.random() * 5 }))); }, []);
    if (!flakes.length) return null;
    return <div className="absolute inset-0 overflow-hidden pointer-events-none">{flakes.map(f => <div key={f.id} className="absolute animate-snowfall" style={{ left: `${f.left}%`, top: '-10px', animationDelay: `${f.delay}s`, animationDuration: `${f.dur}s` }}><div className="bg-white/60 rounded-full" style={{ width: `${f.size}px`, height: `${f.size}px` }} /></div>)}</div>;
}

function StarsBackground() {
    const [stars, setStars] = useState<Array<{ id: number; left: number; top: number; size: number; delay: number }>>([]);
    useEffect(() => { setStars(Array.from({ length: 50 }, (_, i) => ({ id: i, left: Math.random() * 100, top: Math.random() * 100, size: 1 + Math.random() * 2, delay: Math.random() * 3 }))); }, []);
    if (!stars.length) return null;
    return <div className="absolute inset-0 overflow-hidden pointer-events-none">{stars.map(s => <div key={s.id} className="absolute rounded-full bg-white animate-twinkle" style={{ left: `${s.left}%`, top: `${s.top}%`, width: `${s.size}px`, height: `${s.size}px`, animationDelay: `${s.delay}s` }} />)}</div>;
}

function MagicParticles() {
    const [p, setP] = useState<Array<{ id: number; left: number; delay: number; dur: number }>>([]);
    useEffect(() => { setP(Array.from({ length: 12 }, (_, i) => ({ id: i, left: Math.random() * 100, delay: Math.random() * 6, dur: 6 + Math.random() * 4 }))); }, []);
    if (!p.length) return null;
    return <div className="absolute inset-0 overflow-hidden pointer-events-none">{p.map(x => <div key={x.id} className="absolute animate-float-up" style={{ left: `${x.left}%`, bottom: '-20px', animationDelay: `${x.delay}s`, animationDuration: `${x.dur}s` }}><Sparkles className="w-4 h-4 text-yellow-300/60" /></div>)}</div>;
}

function SnowflakeIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
    return <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 2v20M12 2l-3 3M12 2l3 3M12 22l-3-3M12 22l3-3M2 12h20M2 12l3-3M2 12l3 3M22 12l-3-3M22 12l-3 3M4.93 4.93l14.14 14.14M4.93 4.93l0 4M4.93 4.93l4 0M19.07 19.07l0-4M19.07 19.07l-4 0M19.07 4.93L4.93 19.07M19.07 4.93l-4 0M19.07 4.93l0 4M4.93 19.07l4 0M4.93 19.07l0-4" /></svg>;
}

function CastleSVG() {
    return (
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_20px_rgba(135,206,235,0.5)]">
            <defs>
                <linearGradient id="cg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#E8F4FC" /><stop offset="100%" stopColor="#87CEEB" /></linearGradient>
                <linearGradient id="tg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#FFF" /><stop offset="100%" stopColor="#D8ECF4" /></linearGradient>
            </defs>
            <rect x="50" y="120" width="100" height="60" fill="url(#cg)" rx="2" />
            <rect x="85" y="40" width="30" height="100" fill="url(#tg)" />
            <polygon points="100,10 75,45 125,45" fill="url(#tg)" />
            <circle cx="100" cy="25" r="3" fill="#FFD700" className="animate-pulse" />
            <rect x="55" y="70" width="20" height="70" fill="url(#tg)" />
            <polygon points="65,45 50,70 80,70" fill="url(#tg)" />
            <circle cx="65" cy="55" r="2" fill="#FFD700" className="animate-pulse" />
            <rect x="125" y="70" width="20" height="70" fill="url(#tg)" />
            <polygon points="135,45 120,70 150,70" fill="url(#tg)" />
            <circle cx="135" cy="55" r="2" fill="#FFD700" className="animate-pulse" />
            <rect x="35" y="100" width="15" height="50" fill="url(#tg)" />
            <polygon points="42.5,80 30,100 55,100" fill="url(#tg)" />
            <rect x="150" y="100" width="15" height="50" fill="url(#tg)" />
            <polygon points="157.5,80 145,100 170,100" fill="url(#tg)" />
            <rect x="95" y="90" width="10" height="15" fill="#5F84A2" rx="5" />
            <path d="M90 180L90 150Q100 140 110 150L110 180Z" fill="#4169E1" />
            <circle cx="30" cy="30" r="1.5" fill="#FFD700" className="animate-twinkle" />
            <circle cx="170" cy="25" r="1.5" fill="#FFD700" className="animate-twinkle" />
        </svg>
    );
}