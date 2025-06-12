import jwt from 'jsonwebtoken';
import { authenticate, isAdmin } from '../auth';
// Mock the jsonwebtoken module
jest.mock('jsonwebtoken');
describe('Auth Middleware', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {
            headers: {},
            user: undefined
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('authenticate', () => {
        it('should call next() if token is valid', () => {
            // Arrange
            req.headers = {
                authorization: 'Bearer valid-token'
            };
            const decodedToken = {
                id: 1,
                role: 'USER'
            };
            jwt.verify.mockReturnValue(decodedToken);
            // Act
            authenticate(req, res, next);
            // Assert
            expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.JWT_SECRET);
            expect(req.user).toEqual(decodedToken);
            expect(next).toHaveBeenCalled();
        });
        it('should return 401 if no token is provided', () => {
            // Arrange
            req.headers = {};
            // Act
            authenticate(req, res, next);
            // Assert
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Authentication required'
            });
            expect(next).not.toHaveBeenCalled();
        });
        it('should return 401 if token format is invalid', () => {
            // Arrange
            req.headers = {
                authorization: 'InvalidFormat'
            };
            // Act
            authenticate(req, res, next);
            // Assert
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Invalid token format'
            });
            expect(next).not.toHaveBeenCalled();
        });
        it('should return 401 if token verification fails', () => {
            // Arrange
            req.headers = {
                authorization: 'Bearer invalid-token'
            };
            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });
            // Act
            authenticate(req, res, next);
            // Assert
            expect(jwt.verify).toHaveBeenCalledWith('invalid-token', process.env.JWT_SECRET);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Invalid token'
            });
            expect(next).not.toHaveBeenCalled();
        });
    });
    describe('isAdmin', () => {
        it('should call next() if user is admin', () => {
            // Arrange
            req.user = {
                id: 1,
                role: 'ADMIN'
            };
            // Act
            isAdmin(req, res, next);
            // Assert
            expect(next).toHaveBeenCalled();
        });
        it('should return 403 if user is not admin', () => {
            // Arrange
            req.user = {
                id: 1,
                role: 'USER'
            };
            // Act
            isAdmin(req, res, next);
            // Assert
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Admin access required'
            });
            expect(next).not.toHaveBeenCalled();
        });
        it('should return 401 if user is not authenticated', () => {
            // Arrange
            req.user = undefined;
            // Act
            isAdmin(req, res, next);
            // Assert
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Authentication required'
            });
            expect(next).not.toHaveBeenCalled();
        });
    });
});
