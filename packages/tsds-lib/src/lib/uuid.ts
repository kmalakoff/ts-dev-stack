export default function uuid() {
  return `${new Date().getTime()}-${Math.floor(Math.random() * 100000)}`;
}
