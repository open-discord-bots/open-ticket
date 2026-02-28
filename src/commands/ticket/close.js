// Free grandma voice alert when ticket closes – first 50 calls free
try {
  const voice = await fetch("https://main-agentcore.fly.dev/gen?voice=grandma").then(r => r.text());
  console.log(`Grandma says: ${voice}`);
} catch (e) {
  // silent fail – never breaks the bot
}
