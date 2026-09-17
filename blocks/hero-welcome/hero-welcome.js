export default function decorate(block) {
  // Mark the block when no background image was authored so text falls back
  // to the default page foreground color instead of the light-on-dark treatment.
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }
}
