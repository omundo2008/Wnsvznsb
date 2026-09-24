import { TranslationMapping, LanguageSetting } from '../types';

export const DICTIONARY_PT: TranslationMapping[] = [
  {
    keywords: ['ajuda', 'socorro', 'ajude', 'urgente', 'salve', 'emergencia', 'perigo'],
    simplified: 'PRECISO DE AJUDA',
    emoji: '🆘',
  },
  {
    keywords: ['medico', 'médico', 'hospital', 'doutor', 'doente', 'ambulancia', 'ambulância', 'dor', 'ferido', 'sangue', 'magoado'],
    simplified: 'MÉDICO / HOSPITAL',
    emoji: '🩺',
  },
  {
    keywords: ['banheiro', 'sanitario', 'sanitário', 'wc', 'casa de banho', 'quarto de banho', 'mijar', 'cagar'],
    simplified: 'CASA DE BANHO (WC)',
    emoji: '🚹🚺',
  },
  {
    keywords: ['agua', 'água', 'beber', 'sede', 'copo de agua', 'garrafa'],
    simplified: 'QUERO ÁGUA',
    emoji: '💧',
  },
  {
    keywords: ['comida', 'fome', 'comer', 'pao', 'pão', 'restaurante', 'alimento'],
    simplified: 'TENHO FOME',
    emoji: '🍽️',
  },
  {
    keywords: ['perdido', 'onde', 'estou', 'bussola', 'bússola', 'direcao', 'direção', 'localizacao', 'localização', 'rua', 'cidade'],
    simplified: 'ESTOU PERDIDO / ONDE?',
    emoji: '🗺️',
  },
  {
    keywords: ['policia', 'polícia', 'roubo', 'assalto', 'perigo', 'ladrao', 'ladrão', 'crime', 'segurança', 'bater'],
    simplified: 'CHAME A POLÍCIA',
    emoji: '🚔',
  },
  {
    keywords: ['obrigado', 'obrigada', 'agradeço', 'agradecido', 'grato', 'vlw', 'valeu'],
    simplified: 'MUITO OBRIGADO',
    emoji: '🙏',
  },
  {
    keywords: ['sim', 'ok', 'podes', 'quero', 'aceito', 'correto', 'afirmativo'],
    simplified: 'SIM',
    emoji: '✅',
  },
  {
    keywords: ['nao', 'não', 'nunca', 'recuso', 'errado', 'rejeito', 'proibido'],
    simplified: 'NÃO',
    emoji: '❌',
  },
  {
    keywords: ['surdo', 'mudo', 'surda', 'muda', 'audicao', 'audição', 'libras', 'gestos'],
    simplified: 'SOU SURDO / ESCREVA AQUI',
    emoji: '🧏',
  },
  {
    keywords: ['taxi', 'táxi', 'autocarro', 'ônibus', 'onibus', 'metro', 'metrô', 'combio', 'trem', 'transporte', 'carro', 'viagem'],
    simplified: 'TRANSPORTE',
    emoji: '🚗',
  },
  {
    keywords: ['ola', 'olá', 'bom dia', 'boa tarde', 'boa noite', 'saudações', 'oi'],
    simplified: 'OLÁ',
    emoji: '👋',
  },
];

export const DICTIONARY_EN: TranslationMapping[] = [
  {
    keywords: ['help', 'save', 'emergency', 'danger', 'rescue', 'hurt', 'pain', 'urgent'],
    simplified: 'NEED HELP / SOS',
    emoji: '🆘',
  },
  {
    keywords: ['doctor', 'hospital', 'ambulance', 'sick', 'ill', 'blood', 'clinic', 'medicine'],
    simplified: 'DOCTOR / HOSPITAL',
    emoji: '🩺',
  },
  {
    keywords: ['bathroom', 'toilet', 'restroom', 'washroom', 'wc', 'pee', 'poop'],
    simplified: 'RESTROOM (WC)',
    emoji: '🚹🚺',
  },
  {
    keywords: ['water', 'drink', 'thirsty', 'bottle', 'cup of water'],
    simplified: 'WANT WATER',
    emoji: '💧',
  },
  {
    keywords: ['food', 'hungry', 'eat', 'bread', 'restaurant', 'meal'],
    simplified: 'I AM HUNGRY',
    emoji: '🍽️',
  },
  {
    keywords: ['lost', 'where', 'direction', 'location', 'street', 'city', 'map', 'compass'],
    simplified: 'I AM LOST / WHERE?',
    emoji: '🗺️',
  },
  {
    keywords: ['police', 'sheriff', 'robbery', 'thief', 'stolen', 'danger', 'crime', 'cop'],
    simplified: 'CALL THE POLICE',
    emoji: '🚔',
  },
  {
    keywords: ['thank you', 'thanks', 'gracias', 'appreciate', 'ty'],
    simplified: 'THANK YOU SO MUCH',
    emoji: '🙏',
  },
  {
    keywords: ['yes', 'ok', 'sure', 'want', 'agree', 'correct', 'affirmative'],
    simplified: 'YES',
    emoji: '✅',
  },
  {
    keywords: ['no', 'never', 'refuse', 'wrong', 'reject', 'forbidden'],
    simplified: 'NO',
    emoji: '❌',
  },
  {
    keywords: ['deaf', 'mute', 'hearing', 'sign language', 'write'],
    simplified: 'I AM DEAF / WRITE HERE',
    emoji: '🧏',
  },
  {
    keywords: ['taxi', 'cab', 'bus', 'metro', 'subway', 'train', 'transport', 'car', 'ride'],
    simplified: 'TRANSPORT',
    emoji: '🚗',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'],
    simplified: 'HELLO',
    emoji: '👋',
  },
];

export const DICTIONARY_ES: TranslationMapping[] = [
  {
    keywords: ['ayuda', 'socorro', 'urgente', 'salve', 'emergencia', 'peligro', 'auxilio'],
    simplified: 'NECESITO AYUDA',
    emoji: '🆘',
  },
  {
    keywords: ['medico', 'médico', 'hospital', 'doctor', 'enfermo', 'ambulancia', 'dolor', 'herido', 'sangre'],
    simplified: 'MÉDICO / HOSPITAL',
    emoji: '🩺',
  },
  {
    keywords: ['baño', 'bano', 'sanitario', 'wc', 'aseo', 'servicios', 'orinar', 'cagar'],
    simplified: 'CUARTO DE BAÑO (WC)',
    emoji: '🚹🚺',
  },
  {
    keywords: ['agua', 'beber', 'sed', 'vaso de agua', 'botella'],
    simplified: 'QUIERO AGUA',
    emoji: '💧',
  },
  {
    keywords: ['comida', 'hambre', 'comer', 'pan', 'restaurante', 'alimento'],
    simplified: 'TENGO HAMBRE',
    emoji: '🍽️',
  },
  {
    keywords: ['perdido', 'donde', 'dónde', 'estoy', 'brujula', 'brújula', 'direccion', 'dirección', 'calle', 'ciudad', 'mapa'],
    simplified: 'ESTOY PERDIDO / ¿DÓNDE?',
    emoji: '🗺️',
  },
  {
    keywords: ['policia', 'policía', 'robo', 'asalto', 'peligro', 'ladron', 'ladrón', 'crimen', 'seguridad'],
    simplified: 'LLAME A LA POLICÍA',
    emoji: '🚔',
  },
  {
    keywords: ['gracias', 'obrigado', 'agradecido', 'muchas gracias'],
    simplified: 'MUCHAS GRACIAS',
    emoji: '🙏',
  },
  {
    keywords: ['si', 'sí', 'ok', 'quiero', 'acepto', 'correcto', 'afirmativo'],
    simplified: 'SÍ',
    emoji: '✅',
  },
  {
    keywords: ['no', 'nunca', 'rechazo', 'incorrecto', 'prohibido'],
    simplified: 'NO',
    emoji: '❌',
  },
  {
    keywords: ['sordo', 'mudo', 'sorda', 'muda', 'audicion', 'audición', 'lengua de señas', 'escriba'],
    simplified: 'SOY SORDO / ESCRIBA AQUÍ',
    emoji: '🧏',
  },
  {
    keywords: ['taxi', 'autobus', 'autobús', 'metro', 'tren', 'transporte', 'coche', 'carro', 'viaje'],
    simplified: 'TRANSPORTE',
    emoji: '🚗',
  },
  {
    keywords: ['hola', 'buenos dias', 'buenos días', 'buenas tardes', 'buenas noches', 'saludos'],
    simplified: 'HOLA',
    emoji: '👋',
  },
];

export function translatePortugueseText(text: string, lang: LanguageSetting = 'pt'): { simplified: string; emoji: string } {
  const cleaned = text.trim().toLowerCase();

  if (!cleaned) {
    if (lang === 'en') {
      return { simplified: 'ENTER YOUR TEXT', emoji: '⌨️' };
    } else if (lang === 'es') {
      return { simplified: 'ESCRIBA SU TEXTO', emoji: '⌨️' };
    }
    return { simplified: 'INTRODUZA SEU TEXTO', emoji: '⌨️' };
  }

  const dict = lang === 'en' ? DICTIONARY_EN : lang === 'es' ? DICTIONARY_ES : DICTIONARY_PT;

  for (const item of dict) {
    for (const kw of item.keywords) {
      if (cleaned.includes(kw)) {
        return {
          simplified: item.simplified,
          emoji: item.emoji,
        };
      }
    }
  }

  return {
    simplified: text.toUpperCase(),
    emoji: '⚠️',
  };
}
