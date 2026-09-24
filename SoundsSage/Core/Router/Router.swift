import Foundation

struct RouteState: Equatable {
    var intent: RoutePort?
    var actual: RoutePort
    var applied: Bool
    var reason: String
}

enum Router {
    static func reconcile(intent: RoutePort?, actual: RoutePort) -> RouteState {
        guard let intent else {
            return RouteState(
                intent: nil,
                actual: actual,
                applied: true,
                reason: "System route. Sounds Sage did not silently reassign other apps."
            )
        }
        if intent == actual {
            return RouteState(intent: intent, actual: actual, applied: true, reason: "Matches current system route.")
        }
        return RouteState(
            intent: intent,
            actual: actual,
            applied: false,
            reason: "iOS did not apply the requested route. Sounds Sage will not pretend it did."
        )
    }
}
