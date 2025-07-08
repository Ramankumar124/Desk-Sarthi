#ifndef IR_REMOTE_CONTROLL_H
#define IR_REMOTE_CONTROLL_H

#include <IRremote.hpp>

// Forward declarations for the relay pins
extern const int Relay1;
extern const int Relay2;
extern const int Relay3;
extern const int Relay4;

// External RGB ring control functions & variables
extern bool staticColorMode;
extern bool ledsOn;
extern void increaseBrightness();
extern void decreaseBrightness();
extern void nextAnimation();
extern void toggleLEDs();
extern void nextColor();
extern void previousColor();
extern void randomColor();

void IrRemoteReciver()
{
  if (IrReceiver.decode())
  {
    if (IrReceiver.decodedIRData.protocol == UNKNOWN)
    {
      Serial.println(F("Received noise or an unknown (or not yet enabled) protocol"));
      // We have an unknown protocol here, print extended info
      IrReceiver.printIRResultRawFormatted(&Serial, true);

      IrReceiver.resume(); // Do it here, to preserve raw data for printing with printIRResultRawFormatted()
    }
    else
    {
      IrReceiver.resume(); // Early enable receiving of the next IR frame

      IrReceiver.printIRResultShort(&Serial);
      IrReceiver.printIRSendUsage(&Serial);
    }
    Serial.println();

    /*
     * Finally, check the received data and perform actions according to the received command
     */
    if (IrReceiver.decodedIRData.flags & IRDATA_FLAGS_IS_REPEAT)
    {
      Serial.println(F("Repeat received. Here you can repeat the same action as before."));
    }
    else
    {
      if (IrReceiver.decodedIRData.command == 0xA)
      {
        // Toggle Relay1: If it's HIGH set it to LOW, if LOW set it to HIGH
        if (digitalRead(Relay1) == HIGH)
        {
          digitalWrite(Relay1, LOW);
          Serial.println(F("Relay1 turned OFF"));
        }
        else
        {
          digitalWrite(Relay1, HIGH);
          Serial.println(F("Relay1 turned ON"));
        }
        Serial.println(F("Received command 0xA"));
        // do something
      }
      else if (IrReceiver.decodedIRData.command == 0x1A)
      {
        Serial.println(F("Received command 0x1A - Toggle animation mode"));
        // Toggle between static color mode and animation mode
        staticColorMode = !staticColorMode;

        if (!staticColorMode)
        {
          // If switching to animation mode, also cycle to next animation
          nextAnimation();
          Serial.println(F("Animation mode activated"));
        }
        else
        {
          Serial.println(F("Static color mode activated"));
        }
      }
      else if (IrReceiver.decodedIRData.command == 0x1B)
      {
        // Toggle Relay2: If it's HIGH set it to LOW, if LOW set it to HIGH
        if (digitalRead(Relay2) == HIGH)
        {
          digitalWrite(Relay2, LOW);
          Serial.println(F("Relay2 turned OFF"));
        }
        else
        {
          digitalWrite(Relay2, HIGH);
          Serial.println(F("Relay2 turned ON"));
        }
        Serial.println(F("Received command 0x1B"));
      }
      else if (IrReceiver.decodedIRData.command == 0x1F)
      {
        // Toggle Relay3: If it's HIGH set it to LOW, if LOW set it to HIGH
        if (digitalRead(Relay3) == HIGH)
        {
          digitalWrite(Relay3, LOW);
          Serial.println(F("Relay3 turned OFF"));
        }
        else
        {
          digitalWrite(Relay3, HIGH);
          Serial.println(F("Relay3 turned ON"));
        }
        Serial.println(F("Received command 0x1F"));
      }
      else if (IrReceiver.decodedIRData.command == 0xC)
      {
        // Toggle Relay4: If it's HIGH set it to LOW, if LOW set it to HIGH
        if (digitalRead(Relay4) == HIGH)
        {
          digitalWrite(Relay4, LOW);
          Serial.println(F("Relay4 turned OFF"));
        }
        else
        {
          digitalWrite(Relay4, HIGH);
          Serial.println(F("Relay4 turned ON"));
        }
        Serial.println(F("Received command 0xC"));
      }
      else if (IrReceiver.decodedIRData.command == 0x6)
      {
        // Increase brightness
        Serial.println(F("Received command 0x6 - Increase brightness"));
        increaseBrightness();
      }
      else if (IrReceiver.decodedIRData.command == 0x5)
      {
        // Decrease brightness
        Serial.println(F("Received command 0x5 - Decrease brightness"));
        decreaseBrightness();
      }
      else if (IrReceiver.decodedIRData.command == 0x12)
      {
        // Toggle LEDs on/off
        Serial.println(F("Received command 0x12 - Toggle LEDs on/off"));
        toggleLEDs();
      }
      else if (IrReceiver.decodedIRData.command == 0x3)
      {
        // Cycle to next color
        Serial.println(F("Received command 0x3 - Next color"));
        nextColor();
      }
      else if (IrReceiver.decodedIRData.command == 0x2)
      {
        // Go back to previous color
        Serial.println(F("Received command 0x2 - Previous color"));
        previousColor();
      }
      else if (IrReceiver.decodedIRData.command == 0x4)
      {
        // Pick a random color
        Serial.println(F("Received command 0x4 - Random color"));
        randomColor();
      }
    }
  }
}

#endif // IR_REMOTE_CONTROLL_H