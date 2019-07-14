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
#import <Foundation/Foundation.h>

@interface Resources : NSObject

/* Load the Source code */
+ (NSString *)loadSourceCode;

/* Play Wav */
+ (void)playSound:(NSString *)file;

@end
