import jwt from 'jsonwebtoken';
import { User, IUser } from './user.model.js';
import { CustomError } from '../../middleware/errorHandler.js';

interface TokenPayload {
  userId: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private jwtSecret = process.env.JWT_SECRET || 'dev_jwt_secret_key_123';
  private jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'dev_jwt_refresh_secret_key_456';

  /**
   * Register a new user
   */
  public async register(name: string, email: string, password: string): Promise<{ user: Partial<IUser>; tokens: AuthTokens }> {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new CustomError('Email already in use', 400);
    }

    const user = new User({ name, email, password });
    await user.save();

    const tokens = this.generateTokens({ userId: user._id.toString(), role: user.role });

    // Exclude password from returned user details
    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, tokens };
  }

  /**
   * Log in user
   */
  public async login(email: string, password: string): Promise<{ user: Partial<IUser>; tokens: AuthTokens }> {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new CustomError('Invalid credentials', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new CustomError('Invalid credentials', 401);
    }

    const tokens = this.generateTokens({ userId: user._id.toString(), role: user.role });

    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, tokens };
  }

  /**
   * Refresh access token using a valid refresh token
   */
  public async refresh(refreshToken: string): Promise<string> {
    try {
      const decoded = jwt.verify(refreshToken, this.jwtRefreshSecret) as TokenPayload;
      
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new CustomError('User not found', 404);
      }

      // Generate a new access token
      const accessToken = jwt.sign(
        { userId: user._id.toString(), role: user.role },
        this.jwtSecret,
        { expiresIn: '15m' }
      );

      return accessToken;
    } catch (error: any) {
      if (error instanceof CustomError) throw error;
      throw new CustomError('Invalid or expired refresh token', 401);
    }
  }

  /**
   * Get user details by ID
   */
  public async getProfile(userId: string): Promise<Partial<IUser>> {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    return user;
  }

  /**
   * Add movie to watchlist
   */
  public async addToWatchlist(userId: string, movieId: string): Promise<string[]> {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    if (!user.watchlist.includes(movieId)) {
      user.watchlist.push(movieId);
      await user.save();
    }
    return user.watchlist;
  }

  /**
   * Remove movie from watchlist
   */
  public async removeFromWatchlist(userId: string, movieId: string): Promise<string[]> {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    user.watchlist = user.watchlist.filter((id) => id !== movieId);
    await user.save();
    return user.watchlist;
  }

  /**
   * Helper: Generate access and refresh tokens
   */
  private generateTokens(payload: TokenPayload): AuthTokens {
    const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, this.jwtRefreshSecret, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }
}
