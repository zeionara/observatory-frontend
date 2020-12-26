import sha512 from 'crypto-js/sha512';

export default {
  encrypt (message: string) {
      return sha512(message).words.map(word => (word > 0 ? word : -word).toString(16)).join('')
  }
}
