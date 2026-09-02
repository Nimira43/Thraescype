import { useEffect, useRef } from 'react'

const TRACKS = [
  '/audio/track-1.mp3',
  '/audio/track-2.mp3',
  '/audio/track-3.wav',
  '/audio/track-4.ogg',
  '/audio/track-5.mp3',
  '/audio/track-6.mp3',
  '/audio/track-7.ogg',
  '/audio/track-8.wav',
  '/audio/track-9.mp3',
]

const VOLUME = 0.7

export default function BackgroundMusic() {
  const audioRef = useRef(null)
  const trackIndexRef = useRef(0)
  const startedRef = useRef(false)

  useEffect(() => {
    const audio = new Audio(TRACKS[trackIndexRef.current])
    audio.volume = VOLUME
    audioRef.current = audio

    function playNextTrack() {
      trackIndexRef.current = (trackIndexRef.current + 1) % TRACKS.length
      audio.src = TRACKS[trackIndexRef.current]
      audio.play().catch(() => {})
    }

    audio.addEventListener('ended', playNextTrack)

    function startOnFirstInteraction() {
      if (startedRef.current) return
      startedRef.current = true

      audio.play().catch(() => {})

      window.removeEventListener('keydown', startOnFirstInteraction)
      window.removeEventListener('click', startOnFirstInteraction)
    }

    window.addEventListener('keydown', startOnFirstInteraction)
    window.addEventListener('click', startOnFirstInteraction)

    return () => {
      audio.pause()
      audio.removeEventListener('ended', playNextTrack)
      window.removeEventListener('keydown', startOnFirstInteraction)
      window.removeEventListener('click', startOnFirstInteraction)
    }
  }, [])

  return null
}
