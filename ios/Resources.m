/* This file is part of Rolling Balls.
 * Copyright (C) 2013 David Lloyd
 *
 * Rolling Balls is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Rolling Balls is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Rolling Balls.  If not, see <http://www.gnu.org/licenses/>.
 *
 * This code may be installed through thirdparty Application Stores.
 */
#import "Resources.h"
#import <AVFoundation/AVAudioPlayer.h>

@implementation Resources


/* Load the Source code */
+ (NSString *)loadFile:(NSString *)file
{
    NSString     * path       = [[NSBundle mainBundle] pathForResource:file ofType:nil];
    NSFileHandle * fileHandle = [NSFileHandle fileHandleForReadingAtPath:path];
    return [[NSString alloc] initWithData:[fileHandle readDataToEndOfFile] encoding:NSUTF8StringEncoding];
}

/* Load the Source code */
+ (NSString *)loadSourceCode
{
    NSString * html = @"<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01//EN\" \"http://www.w3.org/TR/html4/strict.dtd\">\n    <html>\n<head>\n<title>Rolling Balls</title><script language\"Javascript\">\n";
    html = [NSString stringWithFormat:@"%@%@", html, [Resources loadFile:@"RollingBall.jsinc"]];
    NSString * tail = @"    </script><link rel=\"stylesheet\" type=\"text/css\" href=\"main.css\" /></head><body onload=\"main();\"><canvas id=\"htmlcanvas\" width=\"800\" height=\"592\"></canvas></body></html>";
    return [NSString stringWithFormat:@"%@%@", html, tail];
}

AVAudioPlayer * audioPlayer;

/* Play Wav */
+ (void)playSound:(NSString *) file
{
    NSString  * path       = [[NSBundle mainBundle] pathForResource:file ofType:nil];
    NSError *error = nil;
    audioPlayer = [[AVAudioPlayer alloc]
                   initWithContentsOfURL:[NSURL fileURLWithPath:path]
                   error:&error];
    audioPlayer.delegate = self;
    [audioPlayer play];
    [audioPlayer setNumberOfLoops:INT32_MAX];
}
@end
