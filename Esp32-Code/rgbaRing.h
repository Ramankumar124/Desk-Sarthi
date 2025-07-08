#ifndef RGBA_RING_H
#define RGBA_RING_H

#include <FastLED.h>

#define LED_PIN 14
#define NUM_LEDS 12
#define BRIGHTNESS 100
#define LED_TYPE WS2812B
#define COLOR_ORDER GRB

// Forward declarations of all functions
void staticColorEffect();
void rainbowEffect();
void colorWipeEffect();
void theaterChaseEffect();
void breathingEffect();
void paletteEffect();
void nextColor();
void previousColor();
void randomColor();
void increaseBrightness();
void decreaseBrightness();
void nextAnimation();
void toggleLEDs();

// Global variables
int currentR = 255;
int currentG = 0;
int currentB = 0;
int previousR = 255; // Store previous color values
int previousG = 0;
int previousB = 0;
int currentBrightness = 100;
const int MAX_BRIGHTNESS_LEVEL = 10;
const int BRIGHTNESS_STEP = 25; // 255/10 ~= 25 per step
int brightnessLevel = 4;        // Starting at level 4 (100/25=4)
bool staticColorMode = false;
bool ledsOn = true; // Track LED on/off state

// Define a set of predefined colors for cycling
#define NUM_COLORS 24
const CRGB predefinedColors[NUM_COLORS] = {
    CRGB::Red,          // 0
    CRGB::Green,        // 1
    CRGB::Blue,         // 2
    CRGB::Yellow,       // 3
    CRGB::Purple,       // 4
    CRGB::Cyan,         // 5
    CRGB::White,        // 6
    CRGB::Orange,       // 7
    CRGB::Pink,         // 8
    CRGB::Magenta,      // 9
    CRGB::Lime,         // 10
    CRGB::Turquoise,    // 11
    CRGB::Violet,       // 12
    CRGB::Gold,         // 13
    CRGB::SkyBlue,      // 14
    CRGB::HotPink,      // 15
    CRGB::OrangeRed,    // 16
    CRGB::DeepSkyBlue,  // 17
    CRGB::Chartreuse,   // 18
    CRGB::MediumPurple, // 19
    CRGB::Crimson,      // 20
    CRGB::DarkBlue,     // 21
    CRGB::LawnGreen,    // 22
    CRGB(150, 50, 255)  // 23 - Custom purple-blue
};
int currentColorIndex = 0;

CRGB leds[NUM_LEDS];
CRGBPalette16 myPalette = RainbowColors_p;

int effectIndex = 0;
unsigned long lastChange = 0;
const unsigned long interval = 5000; // 5 seconds

void setRingColor(int r, int g, int b, int brightness)
{
    // Store previous color before changing
    previousR = currentR;
    previousG = currentG;
    previousB = currentB;

    // Set new color
    currentR = r;
    currentG = g;
    currentB = b;
    currentBrightness = map(brightness, 0, 255, 0, BRIGHTNESS);
    FastLED.setBrightness(currentBrightness);
    fill_solid(leds, NUM_LEDS, CRGB(currentR, currentG, currentB));
    FastLED.show();
}

// Function to increase brightness by one level
void increaseBrightness()
{
    if (brightnessLevel < MAX_BRIGHTNESS_LEVEL)
    {
        brightnessLevel++;
        currentBrightness = brightnessLevel * BRIGHTNESS_STEP;
        FastLED.setBrightness(currentBrightness);
        FastLED.show();
        Serial.print(F("Brightness increased to level: "));
        Serial.println(brightnessLevel);
    }
}

// Function to decrease brightness by one level
void decreaseBrightness()
{
    if (brightnessLevel > 1)
    {
        brightnessLevel--;
        currentBrightness = brightnessLevel * BRIGHTNESS_STEP;
        FastLED.setBrightness(currentBrightness);
        FastLED.show();
        Serial.print(F("Brightness decreased to level: "));
        Serial.println(brightnessLevel);
    }
}

// Function to cycle to the next animation effect
void nextAnimation()
{
    effectIndex = (effectIndex + 1) % 5; // Cycle through 5 effects (0-4)
    Serial.print(F("Switched to animation: "));
    Serial.println(effectIndex);
}

// Function to toggle LEDs on and off
void toggleLEDs()
{
    ledsOn = !ledsOn;

    if (ledsOn)
    {
        // Turn LEDs back on with previous settings
        FastLED.setBrightness(currentBrightness);
        Serial.println(F("LEDs turned ON"));
    }
    else
    {
        // Turn LEDs off by setting brightness to 0
        FastLED.setBrightness(0);
        Serial.println(F("LEDs turned OFF"));
    }

    FastLED.show();
}

// Function to cycle to the next color in predefined colors
void nextColor()
{
    // Store previous color before changing
    previousR = currentR;
    previousG = currentG;
    previousB = currentB;

    // Move to next color
    currentColorIndex = (currentColorIndex + 1) % NUM_COLORS;

    // Apply the new color
    currentR = predefinedColors[currentColorIndex].r;
    currentG = predefinedColors[currentColorIndex].g;
    currentB = predefinedColors[currentColorIndex].b;

    // Update LEDs
    fill_solid(leds, NUM_LEDS, CRGB(currentR, currentG, currentB));
    FastLED.show();

    // Ensure we're in static color mode when changing colors manually
    staticColorMode = true;

    Serial.print(F("Color changed to index: "));
    Serial.print(currentColorIndex);
    Serial.print(F(" (R:"));
    Serial.print(currentR);
    Serial.print(F(" G:"));
    Serial.print(currentG);
    Serial.print(F(" B:"));
    Serial.print(currentB);
    Serial.println(F(")"));
}

// Function to select a random color from the palette
void randomColor()
{
    // Store previous color before changing
    previousR = currentR;
    previousG = currentG;
    previousB = currentB;

    // Pick a random color index
    currentColorIndex = random(0, NUM_COLORS);

    // Apply the new color
    currentR = predefinedColors[currentColorIndex].r;
    currentG = predefinedColors[currentColorIndex].g;
    currentB = predefinedColors[currentColorIndex].b;

    // Update LEDs
    fill_solid(leds, NUM_LEDS, CRGB(currentR, currentG, currentB));
    FastLED.show();

    // Ensure we're in static color mode when changing colors manually
    staticColorMode = true;

    Serial.print(F("Random color selected, index: "));
    Serial.print(currentColorIndex);
    Serial.print(F(" (R:"));
    Serial.print(currentR);
    Serial.print(F(" G:"));
    Serial.print(currentG);
    Serial.print(F(" B:"));
    Serial.print(currentB);
    Serial.println(F(")"));
}

// Function to return to previous color
void previousColor()
{
    // Swap current and previous colors
    int tempR = currentR;
    int tempG = currentG;
    int tempB = currentB;

    currentR = previousR;
    currentG = previousG;
    currentB = previousB;

    previousR = tempR;
    previousG = tempG;
    previousB = tempB;

    // Update LEDs
    fill_solid(leds, NUM_LEDS, CRGB(currentR, currentG, currentB));
    FastLED.show();

    // Ensure we're in static color mode when changing colors manually
    staticColorMode = true;

    Serial.println(F("Reverted to previous color"));
}

void updateLEDAnimation()
{
    // Only update animations if LEDs are on
    if (!ledsOn)
    {
        // Skip animation updates when LEDs are off
        return;
    }

    if (staticColorMode)
    {
        staticColorEffect();
    }
    else
    {
        // Otherwise continue with effects
        switch (effectIndex)
        {
        case 0:
            rainbowEffect();
            break;
        case 1:
            colorWipeEffect();
            break;
        case 2:
            theaterChaseEffect();
            break;
        case 3:
            breathingEffect();
            break;
        case 4:
            paletteEffect();
            break;
        }
    }
}

// 🌈 1. Rainbow Effect
void staticColorEffect()
{
    // Just display the current color
    fill_solid(leds, NUM_LEDS, CRGB(currentR, currentG, currentB));
    FastLED.show();
    delay(20);
}
void rainbowEffect()
{
    static uint8_t hue = 0;
    for (int i = 0; i < NUM_LEDS; i++)
    {
        leds[i] = CHSV(hue + i * 10, 255, 255);
    }
    FastLED.show();
    hue++;
    delay(20);
}

// 🔴 2. Color Wipe Effect
void colorWipeEffect()
{
    static int pos = 0;
    fill_solid(leds, NUM_LEDS, CRGB::Black); // clear
    leds[pos] = CRGB::Red;
    FastLED.show();
    delay(100);
    pos = (pos + 1) % NUM_LEDS;
}

// 🔵 3. Theater Chase Effect
void theaterChaseEffect()
{
    static int offset = 0;
    for (int i = 0; i < NUM_LEDS; i++)
    {
        leds[i] = ((i + offset) % 3 == 0) ? CRGB::Blue : CRGB::Black;
    }
    FastLED.show();
    offset = (offset + 1) % 3;
    delay(100);
}

// 🟢 4. Breathing Effect
void breathingEffect()
{
    static uint8_t brightness = 0;
    static int direction = 1;
    brightness += direction;
    if (brightness == 0 || brightness == 255)
        direction = -direction;
    fill_solid(leds, NUM_LEDS, CRGB::Green);
    FastLED.setBrightness(brightness);
    FastLED.show();
    delay(10);
}

// 🌈 5. Palette Animation
void paletteEffect()
{
    static uint8_t index = 0;
    for (int i = 0; i < NUM_LEDS; i++)
    {
        leds[i] = ColorFromPalette(myPalette, index + i * 5);
    }
    FastLED.show();
    index++;
    delay(30);
}

#endif // RGBA_RING_H
